import { existsSync, mkdirSync } from 'fs';
import _get from 'lodash.get';
import {
  ANSWER_CANCEL,
  execAsync,
  flags,
  InstallContext,
  JovoCliError,
  PluginHook,
  printHighlight,
  promptOverwrite,
  Task,
} from '@jovotech/cli-core';
import { GetContext, GetEvents, ParseContextGet } from '@jovotech/cli-command-get';
import {
  checkForGactionsCli,
  getGactionsError,
  getPlatformPath,
  PluginContextGoogle,
} from '../utils';
import { BuildEvents } from '@jovotech/cli-command-build';

export interface GetContextGoogle extends GetContext, PluginContextGoogle {
  args: GetContext['args'];
  flags: GetContext['flags'] & { 'project-id'?: string };
}

export class GetHook extends PluginHook<GetEvents | BuildEvents> {
  $context!: GetContextGoogle;

  install() {
    this.actionSet = {
      'install': [this.addCliOptions.bind(this)],
      'parse': [this.checkForPlatform.bind(this)],
      'before.get': [
        this.updatePluginContext.bind(this),
        this.checkForExistingPlatformFiles.bind(this),
      ],
      'get': [this.get.bind(this)],
    };
  }

  /**
   * Add platform-specific CLI options, including flags and args.
   * @param context - Context providing an access point to command flags and args.
   */
  addCliOptions(context: InstallContext) {
    if (context.command !== 'get') {
      return;
    }

    context.flags['project-id'] = flags.string({
      description: 'Google Cloud Project ID',
    });
  }

  /**
   * Checks if the currently selected platform matches this CLI plugin.
   * @param context - Context containing information after flags and args have been parsed by the CLI.
   */
  checkForPlatform(context: ParseContextGet) {
    // Check if this plugin should be used or not.
    if (context.args.platform && context.args.platform !== this.$plugin.$id) {
      this.uninstall();
    }
  }

  /**
   * Updates the current plugin context with platform-specific values.
   */
  updatePluginContext() {
    if (this.$context.command !== 'get') {
      return;
    }

    this.$context.projectId = this.$context.flags['project-id'] || _get(this.$config, 'projectId');

    if (!this.$context.projectId) {
      throw new JovoCliError(
        'Could not find projectId.',
        'GoogleAssistantCli',
        'Please provide a project id by using the flag "--project-id" or in your project configuration.',
      );
    }
  }

  /**
   * Checks if platform-specific files already exist and prompts for overwriting them.
   */
  async checkForExistingPlatformFiles() {
    if (!this.$context.flags.overwrite && existsSync(getPlatformPath())) {
      const answer = await promptOverwrite('Found existing project files. How to proceed?');
      if (answer.overwrite === ANSWER_CANCEL) {
        this.uninstall();
      }
    }
  }

  /**
   * Fetches platform-specific models, such as intents and entities from the Google Actions Console.
   */
  async get() {
    const getTask: Task = new Task(
      `Getting Conversational Actions Project ${printHighlight(`(${this.$context.projectId})`)}`,
      async () => {
        // Check if gactions CLI is installed.
        await checkForGactionsCli();

        const platformPath: string = getPlatformPath();
        if (!existsSync(platformPath)) {
          mkdirSync(platformPath);
        }

        try {
          await execAsync(
            `gactions pull --clean --force --project-id ${this.$context.projectId} --consumer jovo-cli`,
            { cwd: platformPath },
          );
        } catch (error) {
          throw getGactionsError(error.stderr);
        }
      },
    );

    await getTask.run();
  }
}
