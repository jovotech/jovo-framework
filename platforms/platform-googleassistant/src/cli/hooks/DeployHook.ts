import type {
  DeployPlatformEvents,
  ParseContextDeployPlatform,
} from '@jovotech/cli-command-deploy';
import {
  execAsync,
  JovoCliError,
  PluginHook,
  printStage,
  printWarning,
  ROCKET,
  Task,
} from '@jovotech/cli-core';
import { existsSync } from 'fs';
import indent from 'indent-string';
import { GoogleAssistantCli } from '..';
import { checkForGactionsCli, getGactionsError, PluginContextGoogle } from '../utils';

export class DeployHook extends PluginHook<DeployPlatformEvents> {
  $plugin!: GoogleAssistantCli;
  $context!: PluginContextGoogle;

  install(): void {
    this.middlewareCollection = {
      'parse': [this.checkForPlatform.bind(this)],
      'before.deploy:platform': [checkForGactionsCli, this.checkForPlatformsFolder.bind(this)],
      'deploy:platform': [this.deploy.bind(this)],
    };
  }

  /**
   * Checks if the currently selected platform matches this CLI plugin.
   * @param context - Context containing information after flags and args have been parsed by the CLI.
   */
  checkForPlatform(context: ParseContextDeployPlatform): void {
    // Check if this plugin should be used or not.
    if (context.args.platform && context.args.platform !== this.$plugin.$id) {
      this.uninstall();
    }
  }

  /**
   * Checks if the platform folder for the current plugin exists.
   */
  checkForPlatformsFolder(): void {
    if (!existsSync(this.$plugin.getPlatformPath())) {
      throw new JovoCliError(
        `Couldn't find the platform folder ${this.$plugin.getPlatformPath()}.`,
        this.$plugin.constructor.name,
        `Please use "jovo build" to create platform-specific files.`,
      );
    }
  }

  /**
   * Deploys platform-specific files, such as intents and entities to the Google Actions Console.
   */
  async deploy(): Promise<void> {
    const deployTask: Task = new Task(
      `${ROCKET} Deploying Conversational Action ${printStage(this.$cli.$project!.$stage)}`,
    );

    const pushProjectFilesTask: Task = new Task('Pushing project files', async () => {
      try {
        const { stdout, stderr } = await execAsync(`gactions push --consumer jovo-cli`, {
          cwd: this.$plugin.getPlatformPath(),
        });

        if (stderr) {
          // Check for validation errors.
          const validationErrorString = '[WARNING] Server found validation issues';
          if (stderr.includes(validationErrorString) && stdout) {
            // Try to parse table of validation errors.
            const start: number = stdout.indexOf('Locale');
            const end: number = stdout.indexOf('Done') - 3;
            const validationErrors: string[] = stdout
              .substring(start, end)
              .split('\n')
              .map((el: string) => indent(el.trimEnd(), 2));

            return [printWarning('Validation errors occured'), ...validationErrors];
          }
        }
      } catch (error) {
        throw getGactionsError(error.stderr);
      }
    });

    deployTask.add(pushProjectFilesTask);

    await deployTask.run();
  }
}
