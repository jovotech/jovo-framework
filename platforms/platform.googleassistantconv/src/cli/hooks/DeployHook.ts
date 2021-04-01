import { existsSync } from 'fs';
import _get from 'lodash.get';
import indent from 'indent-string';
import {
  execAsync,
  flags,
  InstallEventArguments,
  JovoCli,
  JovoCliError,
  ParseEventArguments,
  PluginHook,
  printStage,
  printWarning,
  Task,
} from '@jovotech/cli-core';
import { DeployPlatformEvents } from '@jovotech/cli-command-deploy';
import {
  checkForGactionsCli,
  getGactionsError,
  getPlatformPath,
  PluginContextGoogle,
} from '../utils';
import { exec } from 'child_process';
import { promisify } from 'util';

export class DeployHook extends PluginHook<DeployPlatformEvents> {
  install() {
    this.actionSet = {
      'install': [this.addCliOptions.bind(this)],
      'parse': [this.checkForPlatform.bind(this)],
      'before.deploy:platform': [
        this.checkForPlatformsFolder.bind(this),
        this.updatePluginContext.bind(this),
      ],
      'deploy:platform': [this.deploy.bind(this)],
    };
  }

  addCliOptions(args: InstallEventArguments) {
    if (args.command !== 'deploy:platform') {
      return;
    }

    args.flags['project-id'] = flags.string({
      description: 'Google Cloud Project ID',
    });
  }

  checkForPlatform(args: ParseEventArguments) {
    // Check if this plugin should be used or not.
    if (args.flags.platform && args.flags.platform !== this.$config.pluginId) {
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
        this.$config.pluginName!,
        'Please provide a project id by using the flag "--project-id" or in your project configuration.',
      );
    }
  }

  checkForPlatformsFolder() {
    if (!existsSync(getPlatformPath())) {
      throw new JovoCliError(
        `Couldn't find the platform folder ${getPlatformPath()}.`,
        this.$config.pluginName!,
        `Please use "jovo build" to create platform-specific files.`,
      );
    }
  }

  async deploy() {
    const jovo: JovoCli = JovoCli.getInstance();
    const deployTask: Task = new Task(
      `Deploying Conversational Action ${printStage(jovo.$project!.$stage)}`,
      async () => {
        await checkForGactionsCli();

        try {
          await execAsync(`gactions push --consumer jovo-cli`, {
            cwd: getPlatformPath(),
          });
        } catch (error) {
          if (typeof error === 'string') {
            // Check for validation errors.
            const validationErrorString: string = '[WARNING] Server found validation issues';
            if (error.includes(validationErrorString)) {
              // Try to parse table of validation errors.
              const start: number = error.indexOf('Locale');
              const end: number = error.indexOf('Done') - 3;
              const validationErrors: string[] = error
                .substring(start, end)
                .split('\n')
                .map((el: string) => indent(el.trimEnd(), 2));

              return [printWarning('Validation errors occured'), ...validationErrors];
            }
          } else {
            throw getGactionsError(error.message);
          }
        }
      },
    );

    await deployTask.run();
  }
}
