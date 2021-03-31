import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import _get from 'lodash.get';
import _set from 'lodash.set';
import {
  ANSWER_CANCEL,
  flags,
  InstallEventArguments,
  JovoCliPluginContext,
  ParseEventArguments,
  PluginHook,
  printAskProfile,
  promptListForProjectId,
  promptOverwrite,
  Task,
} from '@jovotech/cli/core';
import { GetEvents } from '@jovotech/cli/command-get';
import { BuildEvents } from '@jovotech/cli/command-build';
import { FileBuilder, FileObject } from '@jovotech/filebuilder';

import * as smapi from '../smapi';
import {
  AskSkillList,
  getAccountLinkingPath,
  getAskConfig,
  getAskConfigFolderPath,
  getAskConfigPath,
  getModelPath,
  getModelsPath,
  getPlatformPath,
  getSkillJsonPath,
  JovoCliPluginConfigAlexa,
  JovoCliPluginContextAlexa,
  prepareSkillList,
} from '../utils';
import defaultFiles from '../utils/DefaultFiles.json';

export class GetHook extends PluginHook<GetEvents & BuildEvents> {
  $config!: JovoCliPluginConfigAlexa;

  install() {
    this.actionSet = {
      'install': [this.addCliOptions.bind(this)],
      'parse': [this.checkForPlatform.bind(this)],
      'before.get': [this.checkForExistingPlatformFiles.bind(this)],
      'get': [this.get.bind(this)],
      'after.get': [this.checkForBuild.bind(this)],
    };
  }

  addCliOptions(args: InstallEventArguments) {
    if (args.command !== 'get') {
      return;
    }

    args.flags['ask-profile'] = flags.string({
      default: 'default',
      description: 'Name of used ASK profile',
    });
    args.flags['skill-id'] = flags.string({ char: 's', description: 'Alexa Skill ID' });
  }

  checkForPlatform(args: ParseEventArguments) {
    // Check if this plugin should be used or not.
    if (args.args.platform && args.args.platform !== this.$config.pluginId) {
      this.uninstall();
    }
  }

  /**
   * Updates the current context with plugin-specific values from --skill-id and --ask-profile.
   * @param context - Plugin context.
   */
  updatePluginContext(context: JovoCliPluginContextAlexa) {
    context.askProfile = (context.flags['ask-profile'] as string) || this.$config.askProfile;
    context.skillId = context.flags['skill-id'] as string;
  }

  async checkForExistingPlatformFiles(context: JovoCliPluginContextAlexa) {
    if (!context.flags.overwrite && existsSync(getPlatformPath())) {
      const answer = await promptOverwrite('Found existing project files. How to proceed?');
      if (answer.overwrite === ANSWER_CANCEL) {
        this.uninstall();
      }
    }
  }

  async get(context: JovoCliPluginContextAlexa) {
    let skillId: string | undefined = this.getSkillId(context);
    const getTask: Task = new Task(
      `Getting Alexa Skill projects ${printAskProfile(context.askProfile)}`,
    );

    // If no skill id and thus no specified project can be found, try to prompt for one.
    if (!skillId) {
      const skills: AskSkillList = await smapi.listSkills(context.askProfile);
      const list = prepareSkillList(skills);
      try {
        const answer = await promptListForProjectId(list);

        skillId = answer.projectId;
      } catch (error) {
        return;
      }
    }

    const getSkillInformationTask: Task = new Task('Getting skill information', async () => {
      const skillInformation = await smapi.getSkillInformation(
        skillId!,
        'development',
        context.askProfile,
      );
      writeFileSync(getSkillJsonPath(), JSON.stringify(skillInformation, null, 2));
      this.setAlexaSkillId(skillId!);

      // Try to get account linking information.
      const accountLinkingJson = await smapi.getAccountLinkingInformation(
        skillId!,
        'development',
        context.askProfile,
      );

      if (accountLinkingJson) {
        writeFileSync(
          getAccountLinkingPath(),
          JSON.stringify({ accountLinkingRequest: accountLinkingJson }, null, 2),
        );
        return `Account Linking Information saved to ${getAccountLinkingPath()}`;
      }
    });

    const getModelsTask: Task = new Task('Getting Alexa Skill model files');
    const alexaModelPath: string = getModelsPath();
    if (!existsSync(alexaModelPath)) {
      mkdirSync(alexaModelPath, { recursive: true });
    }

    const skillJson = require(getSkillJsonPath());
    const modelLocales: string[] = [];

    if (context.flags.locale) {
      modelLocales.push(context.flags.locale as string);
    } else {
      const skillJsonLocales = _get(skillJson, 'manifest.publishingInformation.locales');
      modelLocales.push(...Object.keys(skillJsonLocales));
    }

    for (const locale of modelLocales) {
      const localeTask: Task = new Task(locale, async () => {
        const model = await smapi.getInteractionModel(
          skillId!,
          locale,
          'development',
          context.askProfile,
        );
        writeFileSync(getModelPath(locale), JSON.stringify(model, null, 2));
      });
      getModelsTask.add(localeTask);
    }

    getTask.add(getSkillInformationTask, getModelsTask);

    await getTask.run();
  }

  async checkForBuild(ctx: JovoCliPluginContext) {
    if (ctx.flags.build) {
      await this.$emitter.run('reverse.build', ctx);
    }
  }

  /**
   * Returns the skill id for the current Alexa project.
   */
  getSkillId(ctx: JovoCliPluginContext): string | undefined {
    return (
      ctx.flags['skill-id'] ||
      // ToDo: won't work with nested, maybe FileBuilder.normalize() before passing config?
      _get(this.$config, '[".ask/"]["ask-states.json"].profiles.default.skillId') ||
      _get(this.$config, 'options.skillId') ||
      _get(getAskConfig(), 'profiles.default.skillId')
    );
  }

  /**
   * Saves skillId to .ask/config.
   * @param skillId - Skill ID.
   */
  setAlexaSkillId(skillId: string) {
    const askConfigFolderPath: string = getAskConfigFolderPath();
    if (!existsSync(askConfigFolderPath)) {
      mkdirSync(askConfigFolderPath);
    }

    // Check if .ask/ask-states.json exists, if not, build default config.
    const askConfigPath: string = getAskConfigPath();
    if (!existsSync(askConfigPath)) {
      const defaultConfig: FileObject = _get(defaultFiles, '[".ask/"]');
      FileBuilder.buildDirectory(defaultConfig, askConfigPath);
    }

    const askConfigContent: string = readFileSync(askConfigPath, 'utf-8');
    const askConfig = JSON.parse(askConfigContent);
    _set(askConfig, 'profiles.default.skillId', skillId);

    writeFileSync(askConfigPath, JSON.stringify(askConfig, null, 2));
  }
}
