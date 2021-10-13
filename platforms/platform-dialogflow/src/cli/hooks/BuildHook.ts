import type { BuildPlatformContext, BuildPlatformEvents } from '@jovotech/cli-command-build';
import {
  ANSWER_BACKUP,
  ANSWER_CANCEL,
  deleteFolderRecursive,
  getResolvedLocales,
  JovoCliError,
  mergeArrayCustomizer,
  OK_HAND,
  PluginHook,
  printHighlight,
  promptOverwriteReverseBuild,
  REVERSE_ARROWS,
  STATION,
  Task,
  wait,
} from '@jovotech/cli-core';
import { FileBuilder, FileObject, FileObjectEntry } from '@jovotech/filebuilder';
import { JovoModelData, JovoModelDataV3, NativeFileInformation } from '@jovotech/model';
import { JovoModelDialogflow } from '@jovotech/model-dialogflow';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import _get from 'lodash.get';
import _merge from 'lodash.merge';
import _mergeWith from 'lodash.mergewith';
import { join as joinPaths } from 'path';
import { DialogflowCli } from '..';
import DefaultFiles from '../DefaultFiles.json';
import { DialogflowAgent, SupportedLocales, SupportedLocalesType } from '../utilities';

export interface DialogflowBuildContext extends BuildPlatformContext {
  dialogflow: {
    endpoint?: string;
    language?: string;
    supportedLanguages?: string[];
  };
}

export class BuildHook extends PluginHook<BuildPlatformEvents> {
  $plugin!: DialogflowCli;
  $context!: DialogflowBuildContext;

  install(): void {
    this.middlewareCollection = {
      'before.build:platform': [
        this.checkForPlatform.bind(this),
        this.updatePluginContext.bind(this),
        this.checkForCleanBuild.bind(this),
        this.validateLocales.bind(this),
      ],
      'build:platform': [this.validateModels.bind(this), this.buildDialogflowAgent.bind(this)],
      'build:platform.reverse': [this.buildReverse.bind(this)],
    };
  }

  /**
   * Checks if the currently selected platform matches this CLI plugin.
   * @param context - Context containing information after flags and args have been parsed by the CLI.
   */
  checkForPlatform(): void {
    // Check if this plugin should be used or not.
    if (!this.$context.platforms.includes(this.$plugin.id)) {
      this.uninstall();
    }
  }

  /**
   * Checks, if --clean has been set and deletes the platform folder accordingly.
   */
  checkForCleanBuild(): void {
    // If --clean has been set, delete the respective platform folders before building.
    if (this.$context.flags.clean) {
      deleteFolderRecursive(this.$plugin.platformPath);
    }
  }

  /**
   * Checks if any provided locale is not supported, thus invalid.
   */
  validateLocales(): void {
    const locales: SupportedLocalesType[] = this.$context.locales.reduce(
      (locales: string[], locale: string) => {
        locales.push(...getResolvedLocales(locale, SupportedLocales, this.$plugin.config.locales));
        return locales;
      },
      [],
    ) as SupportedLocalesType[];

    for (const locale of locales) {
      const genericLocale: string = locale.substring(0, 2);
      // For Google Conversational Actions, some locales require a generic locale to be set, e.g. en for en-US.
      if (
        SupportedLocales.includes(genericLocale as SupportedLocalesType) &&
        !locales.includes(genericLocale as SupportedLocalesType)
      ) {
        throw new JovoCliError({
          message: `Locale ${printHighlight(locale)} requires a generic locale ${printHighlight(
            genericLocale,
          )}.`,
          module: this.$plugin.name,
        });
      }

      if (!SupportedLocales.includes(locale)) {
        throw new JovoCliError({
          message: `Locale ${printHighlight(locale)} is not supported by Dialogflow.`,
          module: this.$plugin.name,
          learnMore:
            'For more information on multiple language support: https://cloud.google.com/dialogflow/es/docs/reference/language',
        });
      }
    }
  }

  /**
   * Validates Jovo models with platform-specific validators.
   */
  async validateModels(): Promise<void> {
    // Validate Jovo model.
    const validationTask: Task = new Task(`${OK_HAND} Validating Dialogflow model files`);

    for (const locale of this.$context.locales) {
      const localeTask = new Task(locale, async () => {
        const model: JovoModelData | JovoModelDataV3 = await this.$cli.project!.getModel(locale);
        await this.$cli.project!.validateModel(
          locale,
          model,
          JovoModelDialogflow.getValidator(model),
          this.$plugin.name,
        );
        await wait(500);
      });

      validationTask.add(localeTask);
    }

    await validationTask.run();
  }

  /**
   * Updates the current plugin context with platform-specific values.
   */
  updatePluginContext(): void {
    if (!this.$context.dialogflow) {
      this.$context.dialogflow = {};
    }

    this.$context.dialogflow.endpoint =
      _get(this.$plugin.config, 'files["agent.json"].webhook.url') ||
      this.$plugin.config.endpoint ||
      this.$cli.resolveEndpoint(this.$cli.project!.config.getParameter('endpoint') as string);

    this.$context.dialogflow.language =
      _get(this.$plugin.config, 'files["agent.json"].language') || this.$plugin.config.language;

    // If language is not configured, try to parse it from locales.
    if (!this.$context.dialogflow.language) {
      const locales: SupportedLocalesType[] = this.$context.locales.reduce(
        (locales: string[], locale: string) => {
          locales.push(
            ...getResolvedLocales(locale, SupportedLocales, this.$plugin.config.locales),
          );
          return locales;
        },
        [],
      ) as SupportedLocalesType[];

      if (locales.length === 0) {
        // ToDo: Throw error?
        return;
      }

      const primaryLocale: string = locales.shift()!;
      const genericLanguage: string = primaryLocale.substring(0, 2);
      this.$context.dialogflow.language = SupportedLocales.includes(
        genericLanguage as SupportedLocalesType,
      )
        ? genericLanguage
        : primaryLocale;
      this.$context.dialogflow.supportedLanguages = locales;
    }
  }

  async buildDialogflowAgent(): Promise<void> {
    const taskStatus: string = this.$cli.project!.hasPlatform(this.$plugin.platformDirectory)
      ? 'Updating'
      : 'Creating';
    const buildTask: Task = new Task(`${STATION} ${taskStatus} Dialogflow Agent`);

    const projectFilesTask: Task = new Task(
      `${taskStatus} Project Files`,
      this.createDialogflowProjectFiles.bind(this),
    );

    const buildInteractionModelTask: Task = new Task(
      `${taskStatus} Interaction Models`,
      this.createInteractionModel.bind(this),
    );
    // If no model files for the current locales exist, do not build interaction model.
    if (!this.$cli.project!.hasModelFiles(this.$context.locales)) {
      buildInteractionModelTask.disable();
    }

    buildTask.add(projectFilesTask, buildInteractionModelTask);

    await buildTask.run();
  }

  createDialogflowProjectFiles(): void {
    const files: FileObject = FileBuilder.normalizeFileObject(this.$plugin.config.files || {});
    // If platforms folder doesn't exist, take default files and parse them with project.js config into FileBuilder.
    const projectFiles: FileObject = this.$cli.project!.hasPlatform(this.$plugin.platformDirectory)
      ? files
      : _merge(DefaultFiles, files);

    // Set language-specific configuration.
    const agentJson: FileObjectEntry = _merge(projectFiles['agent.json'] || {}, {
      language: this.$context.dialogflow.language,
      supportedLanguages: this.$context.dialogflow.supportedLanguages,
      webhook: { url: this.$context.dialogflow.endpoint, available: true },
    });
    projectFiles['agent.json'] = agentJson;

    FileBuilder.buildDirectory(projectFiles, this.$plugin.platformPath);
  }

  /**
   * Creates and returns tasks for each locale to build the interaction model for Dialogflow.
   */
  async createInteractionModel(): Promise<void> {
    for (const locale of this.$context.locales) {
      const resolvedLocales: string[] = getResolvedLocales(
        locale,
        SupportedLocales,
        this.$plugin.config.locales,
      );
      const resolvedLocalesOutput: string = resolvedLocales.join(', ');
      // If the model locale is resolved to different locales, provide task details, i.e. "en (en-US, en-CA)"".
      const taskDetails: string =
        resolvedLocalesOutput === locale ? '' : `(${resolvedLocalesOutput})`;

      const localeTask: Task = new Task(`${locale} ${taskDetails}`, async () => {
        await this.buildLanguageModel(locale, resolvedLocales);
        await wait(500);
      });
      localeTask.indent(4);
      await localeTask.run();
    }
  }

  /**
   * Builds and saves an Alexa model from a Jovo model.
   * @param modelLocale - Locale of the Jovo model.
   * @param resolvedLocales - Locales to which to resolve the modelLocale.
   */
  async buildLanguageModel(modelLocale: string, resolvedLocales: string[]): Promise<void> {
    if (!existsSync(this.$plugin.intentsFolderPath)) {
      mkdirSync(this.$plugin.intentsFolderPath);
    }

    if (!existsSync(this.$plugin.entitiesFolderPath)) {
      mkdirSync(this.$plugin.entitiesFolderPath);
    }

    try {
      for (const resolvedLocale of resolvedLocales) {
        const model: JovoModelData | JovoModelDataV3 = await this.getJovoModel(modelLocale);
        const jovoModel: JovoModelDialogflow = new JovoModelDialogflow(
          model as JovoModelData,
          resolvedLocale,
        );
        const dialogflowModelFiles: NativeFileInformation[] =
          jovoModel.exportNative() as NativeFileInformation[];

        if (!dialogflowModelFiles || !dialogflowModelFiles.length) {
          // Should actually never happen but who knows
          throw new JovoCliError({
            message: `Could not build Dialogflow files for locale "${modelLocale}"!`,
            module: this.$plugin.name,
          });
        }

        for (const file of dialogflowModelFiles) {
          const filePath: string = joinPaths(this.$plugin.platformPath, ...file.path);
          // Persist id, if file already exists.
          if (existsSync(filePath)) {
            const existingFile = JSON.parse(readFileSync(filePath, 'utf-8'));
            file.content.id = existingFile.id;
          }

          writeFileSync(
            joinPaths(this.$plugin.platformPath, ...file.path),
            JSON.stringify(file.content, null, 2),
          );
        }
      }
    } catch (error) {
      if (error instanceof JovoCliError) {
        throw error;
      }
      throw new JovoCliError({ message: error.message, module: this.$plugin.name });
    }
  }

  async buildReverse(): Promise<void> {
    // Since platform can be prompted for, check if this plugin should actually be executed again.
    if (!this.$context.platforms.includes(this.$plugin.id)) {
      return;
    }

    // Get locales to reverse build from.
    // If --locale is not specified, reverse build from every locale available in the platform folder.
    const selectedLocales: string[] = [];
    const platformLocales: string[] = this.getPlatformLocales();
    if (!this.$context.flags.locale) {
      selectedLocales.push(...platformLocales);
    } else {
      // Otherwise only reverse build from the specified locale if it exists inside the platform folder.
      for (const locale of this.$context.flags.locale) {
        if (platformLocales.includes(locale)) {
          selectedLocales.push(locale);
        } else {
          throw new JovoCliError({
            message: `Could not find platform models for locale: ${printHighlight(locale)}`,
            module: this.$plugin.name,
            hint: `Available locales include: ${platformLocales.join(', ')}`,
          });
        }
      }
    }

    // Try to resolve the locale according to the locale map provided in this.$plugin.config.locales.
    // If en resolves to en-US, this loop will generate { 'en-US': 'en' }
    const buildLocaleMap: { [locale: string]: string } = selectedLocales.reduce(
      (localeMap: { [locale: string]: string }, locale: string) => {
        localeMap[locale] = locale;
        return localeMap;
      },
      {},
    );
    for (const modelLocale in this.$plugin.config.locales) {
      const resolvedLocales: string[] = getResolvedLocales(
        modelLocale,
        SupportedLocales,
        this.$plugin.config.locales,
      );

      for (const selectedLocale of selectedLocales) {
        if (resolvedLocales.includes(selectedLocale)) {
          buildLocaleMap[selectedLocale] = modelLocale;
        }
      }
    }

    // If Jovo model files for the current locales exist, ask whether to back them up or not.
    if (
      this.$cli.project!.hasModelFiles(Object.values(buildLocaleMap)) &&
      !this.$context.flags.clean
    ) {
      const answer = await promptOverwriteReverseBuild();
      if (answer.overwrite === ANSWER_CANCEL) {
        return;
      }
      if (answer.overwrite === ANSWER_BACKUP) {
        // Backup old files.
        const backupTask: Task = new Task('Creating backups');
        for (const locale of Object.values(buildLocaleMap)) {
          const localeTask: Task = new Task(locale, () => this.$cli.project!.backupModel(locale));
          backupTask.add(localeTask);
        }
        await backupTask.run();
      }
    }

    const buildReverseTask: Task = new Task(`${REVERSE_ARROWS} Reversing model files`);

    for (const [platformLocale, modelLocale] of Object.entries(buildLocaleMap)) {
      const taskDetails: string = platformLocale === modelLocale ? '' : `(${modelLocale})`;

      const localeTask: Task = new Task(`${platformLocale} ${taskDetails}`, async () => {
        const dialogflowModelFiles: NativeFileInformation[] = this.getPlatformFiles(platformLocale);
        const jovoModel = new JovoModelDialogflow();
        jovoModel.importNative(dialogflowModelFiles, platformLocale.toLowerCase());
        const nativeData: JovoModelData | undefined = jovoModel.exportJovoModel();

        if (!nativeData) {
          throw new JovoCliError({
            message: 'Something went wrong while exporting your Jovo model.',
            module: this.$plugin.name,
          });
        }
        this.$cli.project!.saveModel(nativeData, modelLocale);
        await wait(500);
      });
      buildReverseTask.add(localeTask);
    }
    await buildReverseTask.run();
  }

  getPlatformFiles(locale: string): NativeFileInformation[] {
    const platformFiles: NativeFileInformation[] = [];
    const folders: string[] = ['entities', 'intents'];

    for (const folder of folders) {
      const folderPath: string = joinPaths(this.$plugin.platformPath, folder);

      if (!existsSync(folderPath)) {
        continue;
      }

      const files: string[] = readdirSync(folderPath);

      for (const file of files) {
        if (file.includes('usersays') && !file.includes(locale.toLowerCase())) {
          continue;
        }
        platformFiles.push({
          path: [folder, file],
          content: JSON.parse(readFileSync(joinPaths(folderPath, file), 'utf-8')),
        });
      }
    }

    return platformFiles;
  }

  /**
   * Returns all locales for the current platform.
   */
  getPlatformLocales(): string[] {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dialogflowAgent: DialogflowAgent = require(this.$plugin.agentJsonPath);
    const locales: string[] = [dialogflowAgent.language];

    if (dialogflowAgent.supportedLanguages) {
      locales.push(...dialogflowAgent.supportedLanguages);
    }

    return locales.map((locale) => {
      // Transform locales such as en-us to en-US.
      if (locale.length === 5) {
        return `${locale.substring(0, 2)}-${locale.substring(3).toUpperCase()}`;
      }
      return locale;
    });
  }

  /**
   * Loads a Jovo model specified by a locale and merges it with plugin-specific models.
   * @param locale - The locale that specifies which model to load.
   */
  async getJovoModel(locale: string): Promise<JovoModelData | JovoModelDataV3> {
    const model: JovoModelData | JovoModelDataV3 = await this.$cli.project!.getModel(locale);

    // Merge model with configured language model in project.js.
    _mergeWith(
      model,
      this.$cli.project!.config.getParameter(`languageModel.${locale}`) || {},
      mergeArrayCustomizer,
    );
    // Merge model with configured, platform-specific language model in project.js.
    _mergeWith(
      model,
      _get(this.$plugin.config, `options.languageModel.${locale}`, {}),
      mergeArrayCustomizer,
    );

    return model;
  }
}
