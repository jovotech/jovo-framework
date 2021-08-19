import type { BuildEvents } from '@jovotech/cli-command-build';
import type { GetContext, GetEvents } from '@jovotech/cli-command-get';
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
import { existsSync, mkdirSync } from 'fs';
import _get from 'lodash.get';
import { GoogleAssistantCli } from '..';
import { checkForGactionsCli, getGactionsError, GoogleContext } from '../utilities';

export interface GoogleGetContext extends GetContext, GoogleContext {
  flags: GetContext['flags'] & { 'project-id'?: string };
}

export class GetHook extends PluginHook<GetEvents | BuildEvents> {
  $plugin!: GoogleAssistantCli;
  $context!: GoogleGetContext;

  install(): void {
    this.middlewareCollection = {
      'install': [this.addCliOptions.bind(this)],
      'before.get': [
        this.checkForPlatform.bind(this),
        checkForGactionsCli,
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
  addCliOptions(context: InstallContext): void {
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
  checkForPlatform(): void {
    // Check if this plugin should be used or not.
    if (this.$context.platform && this.$context.platform !== this.$plugin.$id) {
      this.uninstall();
    }
  }

  /**
   * Updates the current plugin context with platform-specific values.
   */
  updatePluginContext(): void {
    if (!this.$context.googleAssistant) {
      this.$context.googleAssistant = {};
    }

    this.$context.googleAssistant.projectId =
      this.$context.flags['project-id'] || _get(this.$plugin.$config, 'projectId');

    if (!this.$context.googleAssistant.projectId) {
      throw new JovoCliError({
        message: 'Could not find projectId.',
        module: 'GoogleAssistantCli',
        hint: 'Please provide a project id by using the flag "--project-id" or in your project configuration.',
      });
    }
  }

  /**
   * Checks if platform-specific files already exist and prompts for overwriting them.
   */
  async checkForExistingPlatformFiles(): Promise<void> {
    if (!this.$context.flags.overwrite && existsSync(this.$plugin.getPlatformPath())) {
      const answer = await promptOverwrite('Found existing project files. How to proceed?');
      if (answer.overwrite === ANSWER_CANCEL) {
        this.uninstall();
      }
    }
  }

  /**
   * Fetches platform-specific models, such as intents and entities from the Google Actions Console.
   */
  async get(): Promise<void> {
    const getTask: Task = new Task(
      `Getting Conversational Actions Project ${printHighlight(
        `(${this.$context.googleAssistant.projectId})`,
      )}`,
      async () => {
        const platformPath: string = this.$plugin.getPlatformPath();
        if (!existsSync(platformPath)) {
          mkdirSync(platformPath);
        }

        try {
          await execAsync(
            `gactions pull --clean --force --project-id ${this.$context.googleAssistant.projectId} --consumer jovo-cli`,
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
