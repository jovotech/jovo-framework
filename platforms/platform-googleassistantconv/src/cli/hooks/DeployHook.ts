import { existsSync } from 'fs';
import _get from 'lodash.get';
import indent from 'indent-string';
import {
  execAsync,
  JovoCli,
  JovoCliError,
  PluginHook,
  printStage,
  printWarning,
  ROCKET,
  Task,
} from '@jovotech/cli-core';
import { DeployPlatformEvents, ParseContextDeployPlatform } from '@jovotech/cli-command-deploy';
import {
  checkForGactionsCli,
  getGactionsError,
  getPlatformPath,
  PluginContextGoogle,
} from '../utils';

export class DeployHook extends PluginHook<DeployPlatformEvents> {
  $context!: PluginContextGoogle;

  install() {
    this.actionSet = {
      'parse': [this.checkForPlatform.bind(this)],
      'before.deploy:platform': [this.checkForPlatformsFolder.bind(this)],
      'deploy:platform': [this.deploy.bind(this)],
    };
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
   * Checks if the platform folder for the current plugin exists.
   */
  checkForPlatformsFolder() {
    if (!existsSync(getPlatformPath())) {
      throw new JovoCliError(
        `Couldn't find the platform folder ${getPlatformPath()}.`,
        this.$plugin.constructor.name,
        `Please use "jovo build" to create platform-specific files.`,
      );
    }
  }

  /**
   * Deploys platform-specific files, such as intents and entities to the Google Actions Console.
   */
  async deploy() {
    const jovo: JovoCli = JovoCli.getInstance();
    const deployTask: Task = new Task(
      `${ROCKET} Deploying Conversational Action ${printStage(jovo.$project!.$stage)}`,
    );

    const pushProjectFilesTask: Task = new Task('Pushing project files', async () => {
      await checkForGactionsCli();

      try {
        const { stdout, stderr } = await execAsync(`gactions push --consumer jovo-cli`, {
          cwd: getPlatformPath(),
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
