import type { BuildPlatformEvents } from '@jovotech/cli-command-build';
import type { GetPlatformContext, GetPlatformEvents } from '@jovotech/cli-command-get';
import {
  ANSWER_CANCEL,
  DOWNLOAD,
  flags,
  InstallContext,
  MAGNIFYING_GLASS,
  printAskProfile,
  promptListForProjectId,
  promptOverwrite,
  Task,
} from '@jovotech/cli-core';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import _get from 'lodash.get';
import { AlexaCli } from '..';
import * as smapi from '../smapi';
import { AlexaContext, AskSkillList, checkForAskCli, prepareSkillList } from '../utilities';
import { AlexaHook } from './AlexaHook';

export interface GetContextAlexa extends AlexaContext, GetPlatformContext {
  flags: GetPlatformContext['flags'] & { 'ask-profile'?: string; 'skill-id'?: string };
}

export class GetHook extends AlexaHook<BuildPlatformEvents | GetPlatformEvents> {
  $plugin!: AlexaCli;
  $context!: GetContextAlexa;

  install(): void {
    this.middlewareCollection = {
      'install': [this.addCliOptions.bind(this)],
      'before.get:platform': [
        this.checkForPlatform.bind(this),
        checkForAskCli,
        this.updatePluginContext.bind(this),
        this.checkForExistingPlatformFiles.bind(this),
      ],
      'get:platform': [this.get.bind(this)],
    };
  }

  /**
   * Add platform-specific CLI options, including flags and args.
   * @param context - Context providing an access point to command flags and args.
   */
  addCliOptions(context: InstallContext): void {
    if (context.command !== 'get:platform') {
      return;
    }

    context.flags['ask-profile'] = flags.string({
      default: 'default',
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

    this.$context.alexa.skillId =
      this.$context.flags['skill-id'] ||
      _get(
        this.$plugin.config,
        `[".ask/"]["ask-states.json"].profiles.${
          this.$context.alexa.askProfile || 'default'
        }.skillId`,
      ) ||
      _get(this.$plugin.config, 'options.skillId');
  }

  /**
   * Checks if platform-specific files already exist and prompts for overwriting them.
   */
  async checkForExistingPlatformFiles(): Promise<void> {
    if (!this.$context.flags.clean && existsSync(this.$plugin.platformPath)) {
      const answer = await promptOverwrite('Found existing Alexa project files. How to proceed?');
      if (answer.overwrite === ANSWER_CANCEL) {
        this.uninstall();
      }
    }
  }

  /**
   * Fetches platform-specific models from the Alexa Skills Console.
   */
  async get(): Promise<void> {
    const getTask: Task = new Task(
      `${DOWNLOAD} Getting Alexa Skill projects ${printAskProfile(this.$context.alexa.askProfile)}`,
    );

    // If no skill id and thus no specified project can be found, try to prompt for one.
    if (!this.$context.alexa.skillId) {
      let skills: AskSkillList = { skills: [] };
      const getSkillListTask: Task = new Task(
        `${MAGNIFYING_GLASS} Getting a list of all your skills`,
      );

      const searchTask: Task = new Task('Searching', async () => {
        skills = await smapi.listSkills(this.$context.alexa.askProfile);
      });
      getSkillListTask.add(searchTask);

      await getSkillListTask.run();
      const list = prepareSkillList(skills);

      try {
        const answer = await promptListForProjectId(list);

        this.$context.alexa.skillId = answer.projectId;
      } catch (error) {
        return;
      }
    }

    const getSkillInformationTask: Task = new Task('Getting skill information', async () => {
      const skillPackagePath: string = this.$plugin.skillPackagePath;
      if (!existsSync(skillPackagePath)) {
        mkdirSync(skillPackagePath, { recursive: true });
      }

      const skillInformation = await smapi.getSkillInformation(
        this.$context.alexa.skillId!,
        'development',
        this.$context.alexa.askProfile,
      );
      writeFileSync(this.$plugin.skillJsonPath, JSON.stringify(skillInformation, null, 2));
      this.setSkillId(this.$context.alexa.skillId!);

      // Try to get account linking information.
      try {
        const accountLinkingJson = await smapi.getAccountLinkingInformation(
          this.$context.alexa.skillId!,
          'development',
          this.$context.alexa.askProfile,
        );

        if (accountLinkingJson) {
          writeFileSync(
            this.$plugin.accountLinkingPath,
            JSON.stringify({ accountLinkingRequest: accountLinkingJson }, null, 2),
          );
          return `Account Linking Information saved to ${this.$plugin.accountLinkingPath}`;
        }
      } catch (error) {
        // If account linking information is not available, do nothing.
        if (!error.message.includes('AccountLinking is not present for given skillId')) {
          throw error;
        }
      }
    });

    const getModelsTask: Task = new Task('Getting Alexa Skill model files', async () => {
      const alexaModelPath: string = this.$plugin.modelsPath;
      if (!existsSync(alexaModelPath)) {
        mkdirSync(alexaModelPath, { recursive: true });
      }

      const modelLocales: string[] = [];

      if (this.$context.flags.locale) {
        modelLocales.push(...this.$context.flags.locale);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const skillJson = require(this.$plugin.skillJsonPath);
        const skillJsonLocales = _get(skillJson, 'manifest.publishingInformation.locales');
        modelLocales.push(...Object.keys(skillJsonLocales));
      }
      for (const locale of modelLocales) {
        const model = await smapi.getInteractionModel(
          this.$context.alexa.skillId!,
          locale,
          'development',
          this.$context.alexa.askProfile,
        );
        writeFileSync(this.$plugin.getModelPath(locale), JSON.stringify(model, null, 2));
      }
      return `Locales: ${modelLocales.join(', ')}`;
    });

    getTask.add(getSkillInformationTask, getModelsTask);

    await getTask.run();
  }
}
