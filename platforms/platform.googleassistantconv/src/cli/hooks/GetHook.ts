import { existsSync, mkdirSync } from 'fs';
import _get from 'lodash.get';
import {
  ANSWER_CANCEL,
  execAsync,
  flags,
  InstallEventArguments,
  JovoCliError,
  JovoCliPluginContext,
  ParseEventArguments,
  PluginHook,
  printHighlight,
  promptOverwrite,
  Task,
} from '@jovotech/cli-core';
import { GetEvents } from '@jovotech/cli-command-get';
import {
  checkForGactionsCli,
  getGactionsError,
  getPlatformPath,
  PluginContextGoogle,
} from '../utils';
import { BuildEvents } from '@jovotech/cli-command-build';

export class GetHook extends PluginHook<GetEvents & BuildEvents> {
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

  addCliOptions(args: InstallEventArguments) {
    if (args.command !== 'get') {
      return;
    }

    args.flags['project-id'] = flags.string({
      description: 'Google Cloud Project ID',
    });
  }

  checkForPlatform(args: ParseEventArguments) {
    // Check if this plugin should be used or not.
    if (args.args.platform && args.args.platform !== this.$config.pluginId!) {
      this.uninstall();
    }
  }

  /**
   * Updates the current context with plugin-specific values from --project-id.
   * @param context - Plugin context.
   */
  updatePluginContext(context: PluginContextGoogle) {
    if (context.command !== 'get') {
      return;
    }

    context.projectId = context.flags['project-id'] || _get(this.$config, 'projectId');

    if (!context.projectId) {
      throw new JovoCliError(
        'Could not find projectId.',
        'GoogleAssistantCli',
        'Please provide a project id by using the flag "--project-id" or in your project configuration.',
      );
    }
  }

  async checkForExistingPlatformFiles(context: PluginContextGoogle) {
    if (!context.flags.overwrite && existsSync(getPlatformPath())) {
      const answer = await promptOverwrite('Found existing project files. How to proceed?');
      if (answer.overwrite === ANSWER_CANCEL) {
        this.uninstall();
      }
    }
  }

  async get(context: PluginContextGoogle) {
    const getTask: Task = new Task(
      `Getting Conversational Actions Project ${printHighlight(`(${context.projectId})`)}`,
      async () => {
        // Check if gactions CLI is installed.
        await checkForGactionsCli();

        const platformPath: string = getPlatformPath();
        if (!existsSync(platformPath)) {
          mkdirSync(platformPath);
        }

        try {
          await execAsync(
            `gactions pull --clean --force --project-id ${context.projectId} --consumer jovo-cli`,
            { cwd: platformPath },
          );
        } catch (error) {
          throw getGactionsError(error.message);
        }
      },
    );

    await getTask.run();
  }

  async checkForBuild(ctx: JovoCliPluginContext) {
    if (ctx.flags.build) {
      await this.$emitter.run('reverse.build', ctx);
    }
  }
}
