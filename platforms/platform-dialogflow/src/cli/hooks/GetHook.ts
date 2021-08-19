import type { GetContext, GetEvents } from '@jovotech/cli-command-get';
import {
  ANSWER_CANCEL,
  DOWNLOAD,
  execAsync,
  flags,
  InstallContext,
  JovoCliError,
  PluginHook,
  printHighlight,
  promptOverwrite,
  Task,
  wait,
} from '@jovotech/cli-core';
import AdmZip from 'adm-zip';
import axios, { AxiosError } from 'axios';
import { existsSync, mkdirSync } from 'fs';
import { join as joinPaths } from 'path';
import { DialogflowCli } from '..';
import { activateServiceAccount, getGcloudAccessToken } from '../utilities';

export interface DialogflowGetContext extends GetContext {
  flags: GetContext['flags'] & { 'project-id'?: string };
  dialogflow: {
    projectId?: string;
  };
}

export class GetHook extends PluginHook<GetEvents> {
  $plugin!: DialogflowCli;
  $context!: DialogflowGetContext;

  install(): void {
    this.middlewareCollection = {
      'install': [this.addCliOptions.bind(this)],
      'before.get': [
        this.checkForPlatform.bind(this),
        this.checkForGcloudCli.bind(this),
        this.updatePluginContext.bind(this),
        this.checkForExistingPlatformFiles.bind(this),
      ],
      'get': [this.get.bind(this)],
    };
  }

  addCliOptions(context: InstallContext): void {
    if (context.command !== 'get') {
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
    if (this.$context.platform && this.$context.platform !== this.$plugin.$id) {
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
   * Checks if platform-specific files already exist and prompts for overwriting them.
   */
  async checkForExistingPlatformFiles(): Promise<void> {
    if (!this.$context.flags.overwrite && existsSync(this.$plugin.getPlatformPath())) {
      const answer = await promptOverwrite(
        'Found existing Dialogflow project files. How to proceed?',
      );
      if (answer.overwrite === ANSWER_CANCEL) {
        this.uninstall();
      }
    }
  }

  /**
   * Fetches platform-specific models from the Dialogflow Console.
   */
  async get(): Promise<void> {
    const platformPath: string = this.$plugin.getPlatformPath();
    if (!existsSync(platformPath)) {
      mkdirSync(platformPath);
    }

    const getTask: Task = new Task(
      `${DOWNLOAD} Getting Dialogflow Agent files for ${printHighlight(
        this.$context.dialogflow.projectId!,
      )}`,
    );

    const downloadTask: Task = new Task('Downloading project files', async () => {
      const keyFilePath: string | undefined = this.$plugin.$config.keyFile;
      if (!keyFilePath) {
        throw new JovoCliError({
          message: "Couldn't find keyfile.",
          module: this.$plugin.constructor.name,

          hint: 'Please provide a key file for authorization.',
        });
      }
      if (!existsSync(joinPaths(this.$cli.$projectPath, keyFilePath))) {
        throw new JovoCliError({
          message: `Keyfile at ${keyFilePath} does not exist.`,
          module: this.$plugin.constructor.name,
        });
      }

      await activateServiceAccount(keyFilePath);
      const accessToken: string = await getGcloudAccessToken();

      // Get agent from Dialogflow.
      try {
        const response = await axios({
          method: 'POST',
          url: `https://dialogflow.googleapis.com/v2beta1/projects/${this.$context.dialogflow.projectId}/agent:export`, // eslint-disable-line
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const zip: AdmZip = new AdmZip(Buffer.from(response.data.response.agentContent, 'base64'));
        zip.extractAllTo(platformPath, true);
      } catch (error) {
        if ((error as AxiosError).isAxiosError) {
          throw new JovoCliError({
            message: error.message,
            module: this.$plugin.constructor.name,
            details: error.response.data.error.message,
          });
        }
        throw new JovoCliError({ message: error.message, module: this.$plugin.constructor.name });
      }
    });
    const extractTask: Task = new Task(`Extracting files to ${platformPath}`, async () => {
      await wait(500);
    });
    getTask.add(downloadTask, extractTask);

    await getTask.run();
  }
}
