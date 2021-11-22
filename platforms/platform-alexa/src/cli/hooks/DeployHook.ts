import type { DeployPlatformContext, DeployPlatformEvents } from '@jovotech/cli-command-deploy';
import {
  chalk,
  execAsync,
  flags,
  getResolvedLocales,
  InstallContext,
  JovoCliError,
  Log,
  printAskProfile,
  printStage,
  ROCKET,
  Task,
} from '@jovotech/cli-core';
import { existsSync, readdirSync, statSync } from 'fs';
import _get from 'lodash.get';
import { AlexaCli } from '..';
import * as smapi from '../smapi';
import { AlexaContext, checkForAskCli, getFilesIn, SupportedLocales } from '../utilities';
import { AlexaHook } from './AlexaHook';
import {
  bundleProject,
  loadProject,
  loadProjectConfig,
  ParseError,
  validateProject,
} from '@alexa/acdl';
import { join as joinPaths } from 'path';
import AdmZip from 'adm-zip';
import { axios, UnknownObject } from '@jovotech/framework';

export interface DeployPlatformContextAlexa extends AlexaContext, DeployPlatformContext {
  flags: DeployPlatformContext['flags'] & { 'ask-profile'?: string; 'skill-id'?: string };
  alexa: AlexaContext['alexa'] & {
    skillCreated?: boolean;
    isACSkill?: boolean;
  };
}

export class DeployHook extends AlexaHook<DeployPlatformEvents> {
  $plugin!: AlexaCli;
  $context!: DeployPlatformContextAlexa;

  install(): void {
    this.middlewareCollection = {
      'install': [this.addCliOptions.bind(this)],
      'before.deploy:platform': [
        this.checkForPlatform.bind(this),
        checkForAskCli,
        this.updatePluginContext.bind(this),
        this.checkForPlatformsFolder.bind(this),
        this.updatePluginContext.bind(this),
      ],
      'deploy:platform': [this.deploy.bind(this)],
    };
  }

  /**
   * Add platform-specific CLI options, including flags and args.
   * @param context - Context providing an access point to command flags and args.
   */
  addCliOptions(context: InstallContext): void {
    if (context.command !== 'deploy:platform') {
      return;
    }

    context.flags['ask-profile'] = flags.string({
      description: 'Name of used ASK profile',
    });
    context.flags['skill-id'] = flags.string({ char: 's', description: 'Alexa Skill ID' });
  }

  /**
   * Checks if the currently selected platform matches this CLI plugin.
   */
  checkForPlatform(): void {
    // Check if this plugin should be used or not.
    if (!this.$context.platforms.includes(this.$plugin.id)) {
      this.uninstall();
    }
  }

  /**
   * Updates the current plugin context with platform-specific values.
   */
  async updatePluginContext(): Promise<void> {
    if (!this.$context.alexa) {
      this.$context.alexa = {};
    }

    this.$context.alexa.askProfile =
      this.$context.flags['ask-profile'] ||
      this.$plugin.config.askProfile ||
      (await this.getAskProfile());

    this.$context.alexa.skillId = this.$context.flags['skill-id'] || this.getSkillId();
    // TODO: this.$plugin.config.convertsations.enabled enough?
    this.$context.alexa.isACSkill =
      this.$plugin.config.conversations?.enabled && existsSync(this.$plugin.conversationsDirectory);
  }

  /**
   * Checks if the platform folder for the current plugin exists.
   */
  checkForPlatformsFolder(): void {
    if (!existsSync(this.$plugin.platformPath)) {
      throw new JovoCliError({
        message: `Couldn't find the platform folder "${this.$plugin.platformDirectory}/".`,
        module: this.$plugin.name,
        hint: `Please use "jovo build" to create platform-specific files.`,
      });
    }
  }

  /**
   * Deploys platform-specific models to the Alexa Skills Console.
   */
  async deploy(): Promise<void> {
    const deployTask: Task = new Task(
      `${ROCKET} Deploying Alexa Skill ${printStage(this.$cli.project!.stage)}`,
    );

    const zipPath: string = this.$context.alexa.isACSkill
      ? this.$plugin.skillPackagePath
      : joinPaths(this.$plugin.platformPath, 'build', 'skill-package');

    if (this.$context.alexa.isACSkill) {
      const projectConfig = await loadProjectConfig(
        this.$plugin.platformPath,
        this.$context.alexa.askProfile,
      );
      const project = await loadProject(projectConfig);

      if (!this.$plugin.config.conversations?.skipValidation) {
        const errors: ParseError[] = validateProject(project, true);

        if (errors.length) {
          throw new JovoCliError({
            message: 'Validation failed for Alexa Conversations',
            module: this.$plugin.name,
            hint: errors.reduce((errorString: string, error: ParseError) => {
              return [
                errorString,
                Log.info(chalk.dim(`[${error.code.code}]`), {
                  dry: true,
                  newLine: false,
                }),
                Log.info(error.message, { dry: true }),
                error.uri
                  ? Log.info(chalk.dim(error.uri), { dry: true, newLine: false })
                  : undefined,
                error.loc
                  ? Log.info(chalk.dim(`(line ${error.loc.begin.line})`), {
                      dry: true,
                      newLine: false,
                    })
                  : undefined,
              ].join(' ');
            }, ''),
          });
        }
      }

      await bundleProject(project);
    }

    // Compress skill package
    const zip: AdmZip = new AdmZip();

    for (const entry of readdirSync(zipPath)) {
      const path: string = joinPaths(zipPath, entry);
      if (statSync(path).isDirectory()) {
        zip.addLocalFolder(path);
      } else {
        zip.addLocalFile(path);
      }
    }

    try {
      const uploadUrl: string = await smapi.createNewUploadUrl();
      await axios({ url: uploadUrl, method: 'PUT', data: zip.toBuffer() });

      const importUrl: string = this.$context.alexa.skillId
        ? await smapi.importSkillPackage(
            uploadUrl,
            this.$context.alexa.skillId,
            this.$context.alexa.askProfile,
          )
        : await smapi.createSkillPackage(uploadUrl, this.$context.alexa.askProfile);

      // Check import
      const { stdout: importStatus } = await execAsync(
        `ask smapi get-import-status --import-id ${importUrl}`,
      );
      const skillId = JSON.parse(importStatus!).skill.skillId;
      this.$context.alexa.skillId = skillId;
      this.setSkillId(skillId);
    } catch (error) {
      console.log(error);
    }

    // return [`Skill Name: ${skillInfo.name}`, `Skill ID: ${skillInfo.skillId}`];

    if (this.$context.alexa.skillCreated) {
      const enableTestingTask: Task = new Task('Enabling skill for testing', async () => {
        await smapi.enableSkill(
          this.$context.alexa.skillId!,
          'development',
          this.$context.alexa.askProfile,
        );
      });
      deployTask.add(enableTestingTask);
    }

    await deployTask.run();
  }

  /**
   * Returns Alexa Skill ID from .ask/config.
   */
  getSkillId(): string | undefined {
    try {
      const askConfig = this.getAskConfig();
      const askProfile: string = this.$context.alexa.askProfile || 'default';
      const skillId: string = _get(askConfig, `profiles.${askProfile}.skillId`);
      if (skillId && skillId.length > 0) {
        return skillId;
      }
    } catch (err) {
      if (err instanceof JovoCliError) {
        throw err;
      }
      throw new JovoCliError({ message: err.message, module: this.$plugin.name });
    }
  }

  /**
   * Returns skill information.
   */
  getSkillInformation(): { name: string; skillId?: string } {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const skillJson = require(this.$plugin.skillJsonPath);
      const info = {
        name: '',
        skillId: this.getSkillId(),
      };

      const locales = _get(skillJson, 'manifest.publishingInformation.locales', []);

      for (const locale of Object.keys(locales)) {
        info.name += locales[locale].name + ' (' + locale + ') ';
      }

      return info;
    } catch (err) {
      throw new JovoCliError({ message: err.message, module: this.$plugin.name });
    }
  }

  /**
   * Returns the skill's invocation name.
   * @param locale - The locale for which to get the invocation name.
   */
  getInvocationName(locale: string): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const alexaModel = require(this.$plugin.getModelPath(locale));
    return _get(alexaModel, 'interactionModel.languageModel.invocationName');
  }
}
