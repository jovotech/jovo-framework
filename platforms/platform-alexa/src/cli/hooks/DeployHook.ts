import _get from 'lodash.get';
import _set from 'lodash.set';
import {
  flags,
  InstallEventArguments,
  JovoCli,
  JovoCliError,
  ParseEventArguments,
  PluginHook,
  printAskProfile,
  printStage,
  ROCKET,
  Task,
} from '@jovotech/cli-core';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { DeployPlatformEvents, DeployPlatformPluginContext } from '@jovotech/cli-command-deploy';

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
  getSubLocales,
  JovoCliPluginConfigAlexa,
  JovoCliPluginContextAlexa,
} from '../utils';
import DefaultFiles from '../utils/DefaultFiles.json';

export interface DeployPlatformPluginContextAlexa
  extends DeployPlatformPluginContext,
    JovoCliPluginContextAlexa {
  skillCreated?: boolean;
}

export class DeployHook extends PluginHook<DeployPlatformEvents> {
  $config!: JovoCliPluginConfigAlexa;

  install() {
    this.actionSet = {
      'install': [this.addCliOptions.bind(this)],
      'parse': [this.checkForPlatform.bind(this)],
      'before.deploy:platform': [
        this.checkForPlatformsFolder.bind(this),
        this.updatePluginContext.bind(this),
        checkForAskCli,
      ],
      'deploy:platform': [this.deploy.bind(this)],
    };
  }

  addCliOptions(args: InstallEventArguments) {
    if (args.command !== 'deploy:platform') {
      return;
    }

    args.flags['ask-profile'] = flags.string({
      description: 'Name of used ASK profile',
    });
    args.flags['skill-id'] = flags.string({ char: 's', description: 'Alexa Skill ID' });
  }

  checkForPlatform(args: ParseEventArguments) {
    // Check if this plugin should be used or not.
    if (args.flags.platform && args.flags.platform !== this.$config.pluginId) {
      this.uninstall();
    }
  }

  /**
   * Updates the current context with plugin-specific values from --skill-id and --ask-profile.
   * @param context - Plugin context.
   */
  updatePluginContext(context: DeployPlatformPluginContextAlexa) {
    if (context.command !== 'deploy:platform') {
      return;
    }

    context.askProfile = (context.flags['ask-profile'] as string) || this.$config.askProfile;
    context.skillId = (context.flags['skill-id'] as string) || this.getSkillId();
  }

  checkForPlatformsFolder() {
    if (!existsSync(getPlatformPath())) {
      throw new JovoCliError(
        `Couldn't find the platform folder "${getPlatformDirectory()}/".`,
        this.$config.pluginName!,
        `Please use "jovo build" to create platform-specific files.`,
      );
    }
  }

  async deploy(context: DeployPlatformPluginContextAlexa) {
    const jovo: JovoCli = JovoCli.getInstance();
    const deployTask: Task = new Task(
      `${ROCKET} Deploying Alexa Skill ${printStage(jovo.$project!.$stage)}`,
    );

    if (!context.skillId) {
      // Create skill, if it doesn't exist already.
      const createSkillTask: Task = new Task(
        `Creating Alexa Skill project ${printAskProfile(context.askProfile)}`,
        async () => {
          const skillId: string = await smapi.createSkill(getSkillJsonPath(), context.askProfile);
          context.skillId = skillId;
          context.skillCreated = true;

          this.setSkillId(skillId);

          await smapi.updateAccountLinkingInformation(
            skillId,
            getAccountLinkingPath(),
            'development',
            context.askProfile,
          );
          await smapi.getSkillStatus(skillId, context.askProfile);

          const skillInfo = this.getSkillInformation();

          return [`Skill Name: ${skillInfo.name}`, `Skill ID: ${skillInfo.skillId}`];
        },
      );

      deployTask.add(createSkillTask);
    } else {
      const updateSkillTask: Task = new Task(
        `Updating Alexa Skill project ${printAskProfile(context.askProfile)}`,
        async () => {
          await smapi.updateSkill(context.skillId!, getSkillJsonPath(), context.askProfile);
          await smapi.updateAccountLinkingInformation(
            context.skillId!,
            getAccountLinkingPath(),
            'development',
            context.askProfile,
          );
          await smapi.getSkillStatus(context.skillId!, context.askProfile);

          const skillInfo = this.getSkillInformation();

          return [`Skill Name: ${skillInfo.name}`, `Skill ID: ${skillInfo.skillId}`];
        },
      );
      deployTask.add(updateSkillTask);
    }

    const deployInteractionModelTask: Task = new Task(`${ROCKET} Deploying Interaction Model`);
    for (const locale of context.locales) {
      const deployLocales: string[] = [];
      // If locale is of format en, de, ..., try to get sublocales.
      if (locale.length === 2) {
        deployLocales.push(...getSubLocales(this.$config, locale));
      }

      // If no sublocales have been found, just push the locale to deployLocales.
      if (!deployLocales.length) {
        deployLocales.push(locale);
      }

      for (const deployLocale of deployLocales) {
        const localeTask: Task = new Task(deployLocale, async () => {
          await smapi.updateInteractionModel(
            context.skillId!,
            deployLocale,
            getModelPath(deployLocale),
            'development',
            context.askProfile,
          );
          await smapi.getSkillStatus(context.skillId!);
        });

        deployInteractionModelTask.add(localeTask);
      }
    }

    deployTask.add(deployInteractionModelTask);

    if (context.skillCreated) {
      const enableTestingTask: Task = new Task('Enabling skill for testing', async () => {
        await smapi.enableSkill(context.skillId!, 'development', context.askProfile);
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
      throw new JovoCliError(err.message, this.$config.pluginName!);
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
      throw new JovoCliError(err.message, this.$config.pluginName!);
    }
  }

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
      throw new JovoCliError(err.message, this.$config.pluginName!);
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
