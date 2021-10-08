import type { DeployPlatformContext, DeployPlatformEvents } from '@jovotech/cli-command-deploy';
import {
  flags,
  getResolvedLocales,
  InstallContext,
  JovoCliError,
  printAskProfile,
  printStage,
  ROCKET,
  Task,
} from '@jovotech/cli-core';
import { existsSync } from 'fs';
import _get from 'lodash.get';
import { AlexaCli } from '..';
import * as smapi from '../smapi';
import { AlexaContext, checkForAskCli, SupportedLocales } from '../utilities';
import { AlexaHook } from './AlexaHook';

export interface DeployPlatformContextAlexa extends AlexaContext, DeployPlatformContext {
  flags: DeployPlatformContext['flags'] & { 'ask-profile'?: string; 'skill-id'?: string };
  alexa: AlexaContext['alexa'] & {
    skillCreated?: boolean;
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

    if (!this.$context.alexa.skillId) {
      // Create skill, if it doesn't exist already.
      const createSkillTask: Task = new Task(
        `Creating Alexa Skill project ${printAskProfile(this.$context.alexa.askProfile)}`,
        async () => {
          const skillId: string = await smapi.createSkill(
            this.$plugin.skillJsonPath,
            this.$context.alexa.askProfile,
          );
          this.$context.alexa.skillId = skillId;
          this.$context.alexa.skillCreated = true;

          this.setSkillId(skillId);

          await smapi.updateAccountLinkingInformation(
            skillId,
            this.$plugin.accountLinkingPath,
            'development',
            this.$context.alexa.askProfile,
          );
          await smapi.getSkillStatus(skillId, this.$context.alexa.askProfile);

          const skillInfo = this.getSkillInformation();

          return [`Skill Name: ${skillInfo.name}`, `Skill ID: ${skillInfo.skillId}`];
        },
      );

      deployTask.add(createSkillTask);
    } else {
      const updateSkillTask: Task = new Task(
        `Updating Alexa Skill project ${printAskProfile(this.$context.alexa.askProfile)}`,
        async () => {
          await smapi.updateSkill(
            this.$context.alexa.skillId!,
            this.$plugin.skillJsonPath,
            this.$context.alexa.askProfile,
          );
          await smapi.updateAccountLinkingInformation(
            this.$context.alexa.skillId!,
            this.$plugin.accountLinkingPath,
            'development',
            this.$context.alexa.askProfile,
          );
          await smapi.getSkillStatus(this.$context.alexa.skillId!, this.$context.alexa.askProfile);

          const skillInfo = this.getSkillInformation();

          return [`Skill Name: ${skillInfo.name}`, `Skill ID: ${skillInfo.skillId}`];
        },
      );
      deployTask.add(updateSkillTask);
    }

    const resolvedLocales: string[] = this.$context.locales.reduce(
      (locales: string[], locale: string) => {
        locales.push(...getResolvedLocales(locale, SupportedLocales, this.$plugin.config.locales));
        return locales;
      },
      [],
    );
    // ToDo: Improve providing a unique set of resolved locales.
    const locales: string[] = Array.from(new Set(resolvedLocales));

    const deployInteractionModelTask: Task = new Task('Deploying Interaction Model', async () => {
      for (const locale of locales) {
        const localeTask: Task = new Task(locale, async () => {
          await smapi.updateInteractionModel(
            this.$context.alexa.skillId!,
            locale,
            this.$plugin.getModelPath(locale),
            'development',
            this.$context.alexa.askProfile,
          );
          await smapi.getSkillStatus(this.$context.alexa.skillId!);
        });

        localeTask.indent(4);
        await localeTask.run();
      }
    });

    deployTask.add(deployInteractionModelTask);

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
