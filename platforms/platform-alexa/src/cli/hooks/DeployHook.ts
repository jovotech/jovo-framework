import _get from 'lodash.get';
import _set from 'lodash.set';
import {
  flags,
  getResolvedLocales,
  InstallContext,
  JovoCli,
  JovoCliError,
  PluginHook,
  printAskProfile,
  printStage,
  ROCKET,
  Task,
} from '@jovotech/cli-core';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import {
  DeployPlatformEvents,
  DeployPlatformContext,
  ParseContextDeployPlatform,
} from '@jovotech/cli-command-deploy';

import * as smapi from '../smapi';
import {
  checkForAskCli,
  getAccountLinkingPath,
  getAskConfigFolderPath,
  getAskConfigPath,
  getModelPath,
  getPlatformDirectory,
  getPlatformPath,
  getSkillJsonPath,
  PluginConfigAlexa,
  PluginContextAlexa,
  SupportedLocales,
} from '../utils';
import DefaultFiles from '../utils/DefaultFiles.json';

export interface DeployPlatformContextAlexa extends PluginContextAlexa, DeployPlatformContext {
  args: DeployPlatformContext['args'];
  flags: DeployPlatformContext['flags'] & { 'ask-profile'?: string; 'skill-id'?: string };
  skillCreated?: boolean;
}

export class DeployHook extends PluginHook<DeployPlatformEvents> {
  $config!: PluginConfigAlexa;
  $context!: DeployPlatformContextAlexa;

  install() {
    this.actionSet = {
      'install': [this.addCliOptions.bind(this)],
      'parse': [this.checkForPlatform.bind(this)],
      'before.deploy:platform': [
        checkForAskCli,
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
  addCliOptions(context: InstallContext) {
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
   * @param context - Context containing information after flags and args have been parsed by the CLI.
   */
  checkForPlatform(context: ParseContextDeployPlatform) {
    // Check if this plugin should be used or not.
    if (context.args.platform && context.args.platform !== this.$plugin.$id) {
      this.uninstall();
    }
  }

  /**
   * Updates the current plugin context with platform-specific values.
   */
  updatePluginContext() {
    if (this.$context.command !== 'deploy:platform') {
      return;
    }

    this.$context.askProfile = this.$context.flags['ask-profile'] || this.$config.askProfile;
    this.$context.skillId = this.$context.flags['skill-id'] || this.getSkillId();
  }

  /**
   * Checks if the platform folder for the current plugin exists.
   */
  checkForPlatformsFolder() {
    if (!existsSync(getPlatformPath())) {
      throw new JovoCliError(
        `Couldn't find the platform folder "${getPlatformDirectory()}/".`,
        this.$plugin.constructor.name,
        `Please use "jovo build" to create platform-specific files.`,
      );
    }
  }

  /**
   * Deploys platform-specific models to the Alexa Skills Console.
   */
  async deploy() {
    const jovo: JovoCli = JovoCli.getInstance();
    const deployTask: Task = new Task(
      `${ROCKET} Deploying Alexa Skill ${printStage(jovo.$project!.$stage)}`,
    );

    if (!this.$context.skillId) {
      // Create skill, if it doesn't exist already.
      const createSkillTask: Task = new Task(
        `Creating Alexa Skill project ${printAskProfile(this.$context.askProfile)}`,
        async () => {
          const skillId: string = await smapi.createSkill(
            getSkillJsonPath(),
            this.$context.askProfile,
          );
          this.$context.skillId = skillId;
          this.$context.skillCreated = true;

          this.setSkillId(skillId);

          await smapi.updateAccountLinkingInformation(
            skillId,
            getAccountLinkingPath(),
            'development',
            this.$context.askProfile,
          );
          await smapi.getSkillStatus(skillId, this.$context.askProfile);

          const skillInfo = this.getSkillInformation();

          return [`Skill Name: ${skillInfo.name}`, `Skill ID: ${skillInfo.skillId}`];
        },
      );

      deployTask.add(createSkillTask);
    } else {
      const updateSkillTask: Task = new Task(
        `Updating Alexa Skill project ${printAskProfile(this.$context.askProfile)}`,
        async () => {
          await smapi.updateSkill(
            this.$context.skillId!,
            getSkillJsonPath(),
            this.$context.askProfile,
          );
          await smapi.updateAccountLinkingInformation(
            this.$context.skillId!,
            getAccountLinkingPath(),
            'development',
            this.$context.askProfile,
          );
          await smapi.getSkillStatus(this.$context.skillId!, this.$context.askProfile);

          const skillInfo = this.getSkillInformation();

          return [`Skill Name: ${skillInfo.name}`, `Skill ID: ${skillInfo.skillId}`];
        },
      );
      deployTask.add(updateSkillTask);
    }

    const resolvedLocales: string[] = this.$context.locales.reduce(
      (locales: string[], locale: string) => {
        locales.push(
          ...getResolvedLocales(
            locale,
            SupportedLocales,
            this.$plugin.constructor.name,
            this.$config.locales,
          ),
        );
        return locales;
      },
      [],
    );
    // ToDo: Improve providing a unique set of resolved locales.
    const locales: string[] = [...new Set(resolvedLocales)];

    const deployInteractionModelTask: Task = new Task(`${ROCKET} Deploying Interaction Model`);
    for (const locale of locales) {
      const localeTask: Task = new Task(locale, async () => {
        await smapi.updateInteractionModel(
          this.$context.skillId!,
          locale,
          getModelPath(locale),
          'development',
          this.$context.askProfile,
        );
        await smapi.getSkillStatus(this.$context.skillId!);
      });

      deployInteractionModelTask.add(localeTask);
    }

    deployTask.add(deployInteractionModelTask);

    if (this.$context.skillCreated) {
      const enableTestingTask: Task = new Task('Enabling skill for testing', async () => {
        await smapi.enableSkill(this.$context.skillId!, 'development', this.$context.askProfile);
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
      const skillId: string = _get(askConfig, 'profiles.default.skillId');
      if (skillId && skillId.length > 0) {
        return skillId;
      }
    } catch (err) {
      if (err instanceof JovoCliError) {
        throw err;
      }
      throw new JovoCliError(err.message, this.$plugin.constructor.name);
    }
  }

  /**
   * Saves Alexa Skill ID to .ask/config.
   * @param skillId
   */
  setSkillId(skillId: string) {
    const askConfigFolderPath = getAskConfigFolderPath();

    if (!existsSync(askConfigFolderPath)) {
      mkdirSync(askConfigFolderPath);
    }

    // Check if ask-states.json exists, if not, create it.
    if (!existsSync(getAskConfigPath())) {
      this.createEmptyAskConfig();
    }

    const askConfig = JSON.parse(readFileSync(getAskConfigPath(), 'utf-8'));

    _set(askConfig, 'profiles.default.skillId', skillId);

    writeFileSync(getAskConfigPath(), JSON.stringify(askConfig, null, 2));
  }

  /**
   * Returns Alexa Config from .ask/config.
   * ToDo: Typing!
   */
  getAskConfig() {
    try {
      return JSON.parse(readFileSync(getAskConfigPath(), 'utf8'));
    } catch (err) {
      throw new JovoCliError(err.message, this.$plugin.constructor.name);
    }
  }

  /**
   * Creates an empty ask config file.
   */
  createEmptyAskConfig() {
    const config = _get(DefaultFiles, '[".ask"]["ask-states.json"]');
    writeFileSync(getAskConfigPath(), config);
  }

  /**
   * Returns skill information.
   */
  getSkillInformation() {
    try {
      const skillJson = require(getSkillJsonPath());
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
      throw new JovoCliError(err.message, this.$plugin.constructor.name);
    }
  }

  /**
   * Returns the skill's invocation name.
   * @param locale - The locale for which to get the invocation name.
   */
  getInvocationName(locale: string): string {
    const alexaModel = require(getModelPath(locale));
    return _get(alexaModel, 'interactionModel.languageModel.invocationName');
  }
}
