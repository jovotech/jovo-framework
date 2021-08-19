import type { DeployPlatformContext, DeployPlatformEvents } from '@jovotech/cli-command-deploy';
import {
  execAsync,
  flags,
  InstallContext,
  JovoCliError,
  PluginHook,
  printHighlight,
  ROCKET,
  Task,
} from '@jovotech/cli-core';
import AdmZip from 'adm-zip';
import axios, { AxiosError } from 'axios';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { join as joinPaths } from 'path';
import { DialogflowCli } from '..';
import { activateServiceAccount, getGcloudAccessToken } from '../utilities';

export interface DialogflowDeployPlatformContext extends DeployPlatformContext {
  flags: DeployPlatformContext['flags'] & { 'project-id'?: string };
  dialogflow: {
    projectId?: string;
    pathToZip?: string;
  };
}

export class DeployHook extends PluginHook<DeployPlatformEvents> {
  $plugin!: DialogflowCli;
  $context!: DialogflowDeployPlatformContext;

  install(): void {
    this.middlewareCollection = {
      'install': [this.addCliOptions.bind(this)],
      'before.deploy:platform': [
        this.checkForPlatform.bind(this),
        this.checkForGcloudCli.bind(this),
        this.updatePluginContext.bind(this),
        this.checkForPlatformsFolder.bind(this),
      ],
      'deploy:platform': [this.deploy.bind(this)],
    };
  }

  /**
   * Add platform-specific CLI options, including flags and args.
   * @param context - Context providing an access point to command flags and args.
   */
  addCliOptions(context: InstallContext): void {
    if (context.command !== 'deploy:platform') {
      return;
    }

    context.flags['project-id'] = flags.string({
      description: 'Dialogflow Project ID',
    });
  }

  /**
   * Checks if the currently selected platform matches this CLI plugin.
   * @param context - Context containing information after flags and args have been parsed by the CLI.
   */
  checkForPlatform(): void {
    // Check if this plugin should be used or not.
    if (!this.$context.platforms.includes(this.$plugin.$id)) {
      this.uninstall();
    }
  }

  async checkForGcloudCli(): Promise<void> {
    try {
      await execAsync('gcloud --version');
    } catch (error) {
      throw new JovoCliError({
        message: 'Jovo CLI requires gcloud CLI for deployment to Dialogflow.',
        module: this.$plugin.constructor.name,
        learnMore:
          'To install the gcloud CLI, follow this guide: https://cloud.google.com/sdk/docs/install',
      });
    }
  }

  /**
   * Updates the current plugin context with platform-specific values.
   */
  updatePluginContext(): void {
    if (!this.$context.dialogflow) {
      this.$context.dialogflow = {};
    }

    this.$context.dialogflow.projectId =
      this.$context.flags['project-id'] || this.$plugin.$config.projectId;

    if (!this.$context.dialogflow.projectId) {
      throw new JovoCliError({
        message: 'Could not find project ID.',
        module: this.$plugin.constructor.name,
        hint: 'Please provide a project ID by using the flag "--project-id" or in your project configuration.',
      });
    }
  }

  /**
   * Checks if the platform folder for the current plugin exists.
   */
  checkForPlatformsFolder(): void {
    if (!existsSync(this.$plugin.getPlatformPath())) {
      throw new JovoCliError({
        message: `Couldn't find the platform folder "${this.$plugin.platformDirectory}/".`,
        module: this.$plugin.constructor.name,
        hint: `Please use "jovo build" to create platform-specific files.`,
      });
    }
  }

  /**
   * Deploys platform-specific models to the Dialogflow Console.
   */
  async deploy(): Promise<void> {
    const deployTask: Task = new Task(`${ROCKET} Deploying to Dialogflow`);

    const zipTask: Task = new Task('Compressing dialogflow configuration', async () => {
      await this.zipDialogflowFiles();
      return `${this.$context.dialogflow.pathToZip}`;
    });

    const uploadTask: Task = new Task(
      `Uploading your agent for project ${printHighlight(this.$context.dialogflow.projectId!)}`,
      async () => {
        const keyFilePath: string | undefined = this.$plugin.$config.keyFile;
        if (keyFilePath) {
          if (!existsSync(joinPaths(this.$cli.$projectPath, keyFilePath))) {
            throw new JovoCliError({
              message: `Keyfile at ${keyFilePath} does not exist.`,
              module: this.$plugin.constructor.name,
            });
          }

          await activateServiceAccount(keyFilePath);
          const accessToken: string = await getGcloudAccessToken();

          // Upload agent via Dialogflow API.
          try {
            await axios({
              method: 'POST',
              url: `https://dialogflow.googleapis.com/v2/projects/${this.$context.dialogflow.projectId}/agent:restore`,
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              data: {
                agentContent: readFileSync(this.$context.dialogflow.pathToZip!, 'base64'),
              },
            });
          } catch (error) {
            throw new JovoCliError({
              message: (error as AxiosError).message,
              module: this.$plugin.constructor.name,
              details: error.response.data.error.message,
            });
          }
        }
      },
    );

    const trainTask: Task = new Task('Starting agent training', async () => {
      // Start agent training.
      try {
        const accessToken: string = await getGcloudAccessToken();
        await axios({
          method: 'POST',
          url: `https://dialogflow.googleapis.com/v2/projects/${this.$context.dialogflow.projectId}/agent:train`,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        throw new JovoCliError({
          message: (error as AxiosError).message,
          module: this.$plugin.constructor.name,
          details: error.response.data.error.message,
        });
      }
    });

    if (!this.$context.dialogflow.projectId) {
      uploadTask.disable();
      trainTask.disable();
    }

    deployTask.add(zipTask, uploadTask, trainTask);

    await deployTask.run();
  }

  async zipDialogflowFiles(): Promise<void> {
    // Remove existing zip file.
    this.$context.dialogflow.pathToZip = joinPaths(
      this.$plugin.getPlatformPath(),
      'dialogflow_agent.zip',
    );
    if (existsSync(this.$context.dialogflow.pathToZip)) {
      unlinkSync(this.$context.dialogflow.pathToZip);
    }
    const zip: AdmZip = new AdmZip();
    zip.addLocalFolder(this.$plugin.getPlatformPath());
    zip.writeZip(this.$context.dialogflow.pathToZip);
  }
}
