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
   * @param context - Event arguments.
   */
  checkForPlatform(context: ParseContextDeployPlatform) {
    // Check if this plugin should be used or not.
    if (context.args.platform && context.args.platform !== this.$plugin.id) {
      this.uninstall();
    }
  }

  checkForPlatformsFolder() {
    if (!existsSync(getPlatformPath())) {
      throw new JovoCliError(
        `Couldn't find the platform folder ${getPlatformPath()}.`,
        this.$plugin.constructor.name,
        `Please use "jovo build" to create platform-specific files.`,
      );
    }
  }

  async deploy() {
    const jovo: JovoCli = JovoCli.getInstance();
    const deployTask: Task = new Task(
      `${ROCKET} Deploying Conversational Action ${printStage(jovo.$project!.$stage)}`,
    );

    const pushProjectFilesTask: Task = new Task('Pushing project files', async () => {
      await checkForGactionsCli();

      try {
        await execAsync(`gactions push --consumer jovo-cli`, {
          cwd: getPlatformPath(),
        });
      } catch (error) {
        // Check for validation errors.
        const validationErrorString: string = '[WARNING] Server found validation issues';
        if (error.stderr.includes(validationErrorString)) {
          // Try to parse table of validation errors.
          const start: number = error.indexOf('Locale');
          const end: number = error.indexOf('Done') - 3;
          const validationErrors: string[] = error
            .substring(start, end)
            .split('\n')
            .map((el: string) => indent(el.trimEnd(), 2));

          return [printWarning('Validation errors occured'), ...validationErrors];
        }

        throw getGactionsError(error.stderr);
      }
    });

    deployTask.add(pushProjectFilesTask);

    await deployTask.run();
  }
}
