import type { DeployPlatformContext, DeployPlatformEvents } from '@jovotech/cli-command-deploy';
import {
  execAsync,
  JovoCliError,
  Log,
  LogLevel,
  PluginHook,
  printStage,
  ROCKET,
  Task,
} from '@jovotech/cli-core';
import { existsSync } from 'fs';
import indent from 'indent-string';
import { checkForGactionsCli, getGactionsError, GoogleContext } from '../utilities';

export interface GoogleDeployContext extends DeployPlatformContext, GoogleContext {}

export class DeployHook extends PluginHook<DeployPlatformEvents> {
  $context!: GoogleDeployContext;

  install(): void {
    this.middlewareCollection = {
      'before.deploy:platform': [
        this.checkForPlatform.bind(this),
        checkForGactionsCli,
        this.checkForPlatformsFolder.bind(this),
      ],
      'deploy:platform': [this.deploy.bind(this)],
    };
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
   * Checks if the platform folder for the current plugin exists.
   */
  checkForPlatformsFolder(): void {
    if (!existsSync(this.$plugin.platformPath)) {
      throw new JovoCliError({
        message: `Couldn't find the platform folder ${this.$plugin.platformPath}.`,
        module: this.$plugin.name,
        hint: `Please use "jovo build" to create platform-specific files.`,
      });
    }
  }

  /**
   * Deploys platform-specific files, such as intents and entities to the Google Actions Console.
   */
  async deploy(): Promise<void> {
    const deployTask: Task = new Task(
      `${ROCKET} Deploying Conversational Action ${printStage(this.$cli.project!.stage)}`,
    );

    const pushProjectFilesTask: Task = new Task('Pushing project files', async () => {
      try {
        const { stdout, stderr } = await execAsync(`gactions push --consumer jovo-cli`, {
          cwd: this.$plugin.platformPath,
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

            const output: string[] = [
              Log.warning('Validation errors occured', { dry: true, newLine: false }) || '',
            ];
            for (const validationError of validationErrors) {
              output.push(
                Log.info(validationError, { logLevel: LogLevel.Warn, dry: true, newLine: false }) ||
                  '',
              );
            }
            return output;
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
