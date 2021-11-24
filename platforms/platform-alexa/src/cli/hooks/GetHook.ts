import { decompileProject, loadProject, loadProjectConfig } from '@alexa/acdl';
import type { BuildPlatformEvents } from '@jovotech/cli-command-build';
import DefaultFiles from '../DefaultFiles.json';
import type { GetPlatformContext, GetPlatformEvents } from '@jovotech/cli-command-get';
import {
  ANSWER_CANCEL,
  deleteFolderRecursive,
  DOWNLOAD,
  flags,
  InstallContext,
  JovoCliError,
  Log,
  MAGNIFYING_GLASS,
  printAskProfile,
  promptOverwrite,
  Task,
} from '@jovotech/cli-core';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import _get from 'lodash.get';
import _set from 'lodash.set';
import { AlexaCli } from '..';
import { AlexaContext, AskResources, AskSkillList } from '../interfaces';
import * as smapi from '../smapi';
import { checkForAskCli, prepareSkillList, promptListForAlexaSkill } from '../utilities';
import { AlexaHook } from './AlexaHook';

export interface GetContextAlexa extends AlexaContext, GetPlatformContext {
  flags: GetPlatformContext['flags'] & {
    'ask-profile'?: string;
    'skill-id'?: string;
    'skill-stage'?: string;
  };
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
        this.checkForCleanGet.bind(this),
        this.checkForExistingPlatformFiles.bind(this),
        this.checkForPlatformsFolder.bind(this),
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
    context.flags['skill-stage'] = flags.string({
      description: 'Alexa Skill Stage',
      options: ['development', 'live', 'certification'],
      default: 'development',
    });
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
    super.updatePluginContext();

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

    this.$context.alexa.skillStage = this.$context.flags['skill-stage'];
  }

  /**
   * Checks if --clean has been set and deletes the platform folder accordingly
   */
  checkForCleanGet(): void {
    // If --clean has been set, delete the respective platform folders before building
    if (this.$context.flags.clean) {
      deleteFolderRecursive(this.$plugin.platformPath);
    }
  }

  /**
   * Checks if platform-specific files already exist and prompts for overwriting them.
   */
  async checkForExistingPlatformFiles(): Promise<void> {
    if (existsSync(this.$plugin.skillPackagePath)) {
      const answer = await promptOverwrite('Found existing Alexa skill package. How to proceed?');
      if (answer.overwrite === ANSWER_CANCEL) {
        this.uninstall();
      }
      deleteFolderRecursive(this.$plugin.skillPackagePath);
      Log.spacer();
    }
  }

  /**
   * Checks if the platform folder for the current plugin exists
   */
  checkForPlatformsFolder(): void {
    if (!existsSync(this.$plugin.platformPath)) {
      mkdirSync(this.$plugin.platformPath);
    }
  }

  /**
   * Fetches platform-specific models from the Alexa Skills Console.
   */
  async get(): Promise<void> {
    // If no skill id and thus no specified project can be found, try to prompt for one.
    if (!this.$context.alexa.skillId) {
      let skills: AskSkillList = { skills: [] };

      const getSkillListTask: Task = new Task(
        `${MAGNIFYING_GLASS} Getting a list of all your skills`,
      );

      const searchTask: Task = new Task('Fetching', async () => {
        skills = await smapi.listSkills(this.$context.alexa.askProfile);
      });
      getSkillListTask.add(searchTask);

      await getSkillListTask.run();
      Log.spacer();
      const list = prepareSkillList(skills);

      try {
        const { skill } = await promptListForAlexaSkill(list);
        Log.spacer();

        this.$context.alexa.skillId = skill.skillId;
        this.$context.alexa.skillStage = skill.stage;
      } catch (error) {
        return;
      }
    }

    const getTask: Task = new Task(
      `${DOWNLOAD} Getting Alexa skill project ${printAskProfile(this.$context.alexa.askProfile)}`,
    );

    const exportTask: Task = new Task('Exporting skill package', async () => {
      await smapi.exportSkillPackage(
        this.$context.alexa.skillId!,
        this.$context.alexa.skillStage!,
        this.$plugin.platformPath,
        this.$context.alexa.askProfile,
      );
    });
    getTask.add(exportTask);

    // TODO: Test if this works if this is false but skill.json contains ac entries
    if (this.$context.alexa.isACSkill) {
      const decompileTask: Task = new Task('Decompiling ACDL files', async () => {
        const projectConfig = await loadProjectConfig(
          this.$plugin.platformPath,
          this.$context.alexa.askProfile,
        );
        const project = await loadProject(projectConfig);

        const s = await decompileProject(project);
        Log.info(s);
      });
      getTask.add(decompileTask);
    }

    // Create ask-resources.json
    if (!existsSync(this.$plugin.askResourcesPath)) {
      const askResources: AskResources = _get(DefaultFiles, 'ask-resources.json');
      _set(askResources, `profiles.${this.$context.alexa.askProfile || 'default'}`, {
        skillMetadata: {
          src: './skill-package',
        },
      });
      writeFileSync(this.$plugin.askResourcesPath, JSON.stringify(askResources, null, 2));
    }

    // Set skill ID and generate .ask/ask-states.json if it does not yet exist
    this.setSkillId(this.$context.alexa.skillId);

    await getTask.run();
  }
}
