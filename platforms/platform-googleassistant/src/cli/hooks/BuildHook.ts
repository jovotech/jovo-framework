import type { BuildPlatformContext, BuildPlatformEvents } from '@jovotech/cli-command-build';
import {
  ANSWER_BACKUP,
  ANSWER_CANCEL,
  deleteFolderRecursive,
  DISK,
  flags,
  getResolvedLocales,
  InstallContext,
  JovoCliError,
  mergeArrayCustomizer,
  OK_HAND,
  PluginHook,
  printHighlight,
  printStage,
  printSubHeadline,
  promptOverwriteReverseBuild,
  REVERSE_ARROWS,
  STATION,
  Task,
  wait,
} from '@jovotech/cli-core';
import { FileBuilder, FileObject } from '@jovotech/filebuilder';
import { JovoModelData, JovoModelDataV3, NativeFileInformation } from '@jovotech/model';
import { JovoModelGoogle } from '@jovotech/model-google';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { copySync, removeSync } from 'fs-extra';
import _get from 'lodash.get';
import _has from 'lodash.has';
import _merge from 'lodash.merge';
import _mergeWith from 'lodash.mergewith';
import _set from 'lodash.set';
import { join as joinPaths } from 'path';
import * as yaml from 'yaml';
import { GoogleAssistantCli } from '..';
import DefaultFiles from '../DefaultFiles.json';
import {
  GoogleActionActions,
  GoogleContext,
  SupportedLocales,
  SupportedLocalesType,
} from '../utilities';

export interface BuildPlatformContextGoogle extends BuildPlatformContext, GoogleContext {
  flags: BuildPlatformContext['flags'] & { 'project-id'?: string };
  googleAssistant: GoogleContext['googleAssistant'] & {
    defaultLocale?: string;
  };
}

export class BuildHook extends PluginHook<BuildPlatformEvents> {
  $plugin!: GoogleAssistantCli;
  $context!: BuildPlatformContextGoogle;

  install(): void {
    this.middlewareCollection = {
      'install': [this.addCliOptions.bind(this)],
      'before.build:platform': [
        this.checkForPlatform.bind(this),
        this.updatePluginContext.bind(this),
        this.checkForCleanBuild.bind(this),
        this.validateLocales.bind(this),
      ],
      'build:platform': [this.validateModels.bind(this), this.build.bind(this)],
      'build:platform.reverse': [this.buildReverse.bind(this)],
    };
  }

  /**
   * Add platform-specific CLI options, including flags and args.
   * @param context - Context providing an access point to command flags and args.
   */
  addCliOptions(context: InstallContext): void {
    if (context.command !== 'build:platform') {
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
    if (!this.$context.platforms.includes(this.$plugin.id)) {
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
      this.$context.flags['project-id'] || _get(this.$plugin.config, 'projectId');

    if (!this.$context.googleAssistant.projectId) {
      throw new JovoCliError({
        message: 'Could not find project ID.',
        module: this.$plugin.name,
        hint: 'Please provide a project ID by using the flag "--project-id" or in your project configuration.',
      });
    }

    // Set default locale.
    this.setDefaultLocale();
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
          message: `Locale ${printHighlight(
            locale,
          )} is not supported by Google Conversational Actions.`,
          module: this.$plugin.name,
          learnMore:
            'For more information on multiple language support: https://developers.google.com/assistant/console/languages-locales',
        });
      }
    }
  }

  /**
   * Validates Jovo models with platform-specific validators.
   */
  async validateModels(): Promise<void> {
    // Validate Jovo model.
    const validationTask: Task = new Task(`${OK_HAND} Validating Google Assistant model files`);

    for (const locale of this.$context.locales) {
      const localeTask = new Task(locale, async () => {
        const model: JovoModelData | JovoModelDataV3 = await this.$cli.project!.getModel(locale);
        await this.$cli.project!.validateModel(
          locale,
          model,
          JovoModelGoogle.getValidator(model),
          this.$plugin.name,
        );
        await wait(500);
      });

      validationTask.add(localeTask);
    }

    await validationTask.run();
  }

  /**
   * Builds Jovo model files from platform-specific files.
   */
  async buildReverse(): Promise<void> {
    // Since platform can be prompted for, check if this plugin should actually be executed again.
    if (!this.$context.platforms.includes(this.$plugin.id)) {
      return;
    }

    this.updatePluginContext();

    const reverseBuildTask: Task = new Task(`${REVERSE_ARROWS} Reversing model files`);

    if (this.$cli.project!.config.getParameter('models.enabled') !== false) {
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
          const backupTask: Task = new Task(`${DISK} Creating backups`);
          for (const locale of Object.values(buildLocaleMap)) {
            const localeTask: Task = new Task(locale, () => this.$cli.project!.backupModel(locale));
            backupTask.add(localeTask);
          }
          await backupTask.run();
        }
      }

      for (const [platformLocale, modelLocale] of Object.entries(buildLocaleMap)) {
        const taskDetails: string = platformLocale === modelLocale ? '' : `(${modelLocale})`;
        const localeTask: Task = new Task(`${platformLocale} ${taskDetails}`, async () => {
          // Extract platform models, containing platform-specific intents and entities.
          const platformFiles: NativeFileInformation[] = this.getPlatformModels(platformLocale);
          const jovoModel: JovoModelGoogle = new JovoModelGoogle();
          jovoModel.importNative(platformFiles, modelLocale);
          const nativeData: JovoModelData | undefined = jovoModel.exportJovoModel();
          if (!nativeData) {
            throw new JovoCliError({
              message: 'Something went wrong while exporting your Jovo model.',
              module: this.$plugin.name,
            });
          }

          nativeData.invocation = this.getPlatformInvocationName(platformLocale);

          this.$cli.project!.saveModel(nativeData, modelLocale);
          await wait(500);
        });
        reverseBuildTask.add(localeTask);
      }
    }
    await reverseBuildTask.run();
  }

  /**
   * Builds platform-specific models from Jovo language model.
   */
  async build(): Promise<void> {
    const buildPath = `Path: ./${joinPaths(
      this.$cli.project!.getBuildDirectory(),
      this.$plugin.platformDirectory,
    )}`;

    const buildTaskTitle = `${STATION} Building Google Conversational Action files${printStage(
      this.$cli.project!.stage,
    )}\n${printSubHeadline(buildPath)}`;

    // Define main build task
    const buildTask: Task = new Task(buildTaskTitle);

    // Update or create Google Conversational Action project files, depending on whether it has already been built or not
    const projectFilesTask: Task = new Task(`Project files`, this.buildProjectFiles.bind(this));

    const buildInteractionModelTask: Task = new Task(
      `Interaction model`,
      this.buildInteractionModel.bind(this),
      {
        enabled:
          this.$cli.project!.config.getParameter('models.enabled') !== false &&
          this.$cli.project!.hasModelFiles(this.$context.locales),
      },
    );

    buildTask.add(projectFilesTask, buildInteractionModelTask);

    await buildTask.run();
  }

  /**
   * Creates Google Conversational Action specific project files.
   */
  async buildProjectFiles(): Promise<void> {
    const files: FileObject = FileBuilder.normalizeFileObject(
      _get(this.$plugin.config, 'files', {}),
    );
    // If platforms folder doesn't exist, take default files and parse them with project.js config into FileBuilder.
    const projectFiles: FileObject = this.$cli.project!.hasPlatform(this.$plugin.platformDirectory)
      ? files
      : _merge(DefaultFiles, files);
    // Get default locale.
    // Merge global project.js properties with platform files.
    // Set endpoint.
    const endpoint: string = this.getPluginEndpoint();
    const webhookPath = 'webhooks/["ActionsOnGoogleFulfillment.yaml"]';

    if (endpoint && !_has(projectFiles, webhookPath)) {
      const defaultHandler = {
        handlers: [
          {
            name: 'Jovo',
          },
        ],
        httpsEndpoint: {
          baseUrl: this.getPluginEndpoint(),
        },
      };

      _set(projectFiles, webhookPath, defaultHandler);
    }

    // Set default settings, such as displayName.
    for (const locale of this.$context.locales) {
      const resolvedLocales: SupportedLocalesType[] = getResolvedLocales(
        locale,
        SupportedLocales,
        this.$plugin.config.locales,
      ) as SupportedLocalesType[];
      for (const resolvedLocale of resolvedLocales) {
        const settingsPathArr: string[] = ['settings/'];

        if (resolvedLocale !== this.$context.googleAssistant.defaultLocale!) {
          settingsPathArr.push(`${resolvedLocale}/`);
        }

        settingsPathArr.push('["settings.yaml"]');

        const settingsPath: string = settingsPathArr.join('.');

        // Set default settings.
        if (resolvedLocale === this.$context.googleAssistant.defaultLocale) {
          if (!_has(projectFiles, `${settingsPath}.defaultLocale`)) {
            _set(
              projectFiles,
              `${settingsPath}.defaultLocale`,
              this.$context.googleAssistant.defaultLocale!,
            );
          }

          if (!_has(projectFiles, `${settingsPath}.projectId`)) {
            _set(
              projectFiles,
              `${settingsPath}.projectId`,
              this.$context.googleAssistant.projectId,
            );
          }
        }

        // Set minimal required localized settings, such as displayName and pronunciation.
        const localizedSettingsPath = `${settingsPath}.localizedSettings`;

        const invocationName: string = await this.getInvocationName(locale);
        if (!_has(projectFiles, `${localizedSettingsPath}.displayName`)) {
          _set(projectFiles, `${localizedSettingsPath}.displayName`, invocationName);
        }
        if (!_has(projectFiles, `${localizedSettingsPath}.pronunciation`)) {
          _set(projectFiles, `${localizedSettingsPath}.pronunciation`, invocationName);
        }
      }
    }

    FileBuilder.buildDirectory(projectFiles, this.$plugin.platformPath);

    if (existsSync(this.$plugin.config.resourcesDirectory)) {
      // Copies across any resources so they can be used in the project settings manifest.
      // Docs:  https://developers.google.com/assistant/conversational/build/projects?hl=en&tool=sdk#add_resources
      const copyResourcesTask: Task = new Task(
        `Copying resources from ${this.$plugin.config.resourcesDirectory!}`,
        () => {
          const src: string = joinPaths(
            this.$cli.projectPath,
            this.$plugin.config.resourcesDirectory!,
          );
          const dest: string = joinPaths(this.$plugin.platformPath, 'resources');
          // Delete existing resources folder before copying data
          removeSync(dest);
          copySync(src, dest);
        },
        { indentation: 2 },
      );

      await copyResourcesTask.run();
    }
  }

  /**
   * Creates and returns tasks for each locale to build the interaction model for Alexa.
   */
  async buildInteractionModel(): Promise<string[]> {
    const output: string[] = [];

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

      await this.buildLanguageModel(locale, resolvedLocales);
      await wait(500);
      output.push(`${locale} ${taskDetails}`);
    }

    return output;
  }

  /**
   * Builds and saves a Google Conversational Action model from a Jovo model.
   * @param modelLocale - Locale of the Jovo model.
   * @param resolvedLocales - Locales to which to resolve the modelLocale.
   */
  async buildLanguageModel(modelLocale: string, resolvedLocales: string[]): Promise<void> {
    const model = _merge(
      await this.getJovoModel(modelLocale),
      this.$cli.project!.config.getParameter(`models.override.${modelLocale}`),
    );

    for (const locale of resolvedLocales) {
      const jovoModel = new JovoModelGoogle(
        model as JovoModelData,
        locale,
        this.$context.googleAssistant.defaultLocale,
      );
      const modelFiles: NativeFileInformation[] = jovoModel.exportNative()!;

      const actions: GoogleActionActions = {
        custom: {
          'actions.intent.MAIN': {},
        },
      };

      for (const file of modelFiles) {
        const fileName = file.path.pop()!;
        const modelPath = joinPaths(this.$plugin.platformPath, ...file.path);

        // Check if the path for the current model type (e.g. intent, types, ...) exists.
        if (!existsSync(modelPath)) {
          mkdirSync(modelPath, { recursive: true });
        }

        // Register actions.
        if (file.path.includes('global')) {
          actions.custom[fileName.replace('.yaml', '')] = {};
        }

        writeFileSync(joinPaths(modelPath, fileName), file.content);
      }

      // Merge existing actions file with configuration in project.js.
      _merge(actions, this.getProjectActions());

      const actionsPath: string = joinPaths(this.$plugin.platformPath, 'actions');
      if (!existsSync(actionsPath)) {
        mkdirSync(actionsPath, { recursive: true });
      }
      writeFileSync(joinPaths(actionsPath, 'actions.yaml'), yaml.stringify(actions));
    }
  }

  /**
   * Gets configured actions from config.
   */
  getProjectActions(): void {
    const actions = _get(this.$plugin.config, 'files.["actions/"]');
    return actions;
  }

  /**
   * Sets the default locale for the current Conversational Action.
   */
  setDefaultLocale(): void {
    const resolvedLocales: SupportedLocalesType[] = this.$context.locales.reduce(
      (locales: string[], locale: string) => {
        locales.push(...getResolvedLocales(locale, SupportedLocales, this.$plugin.config.locales));
        return locales;
      },
      [],
    ) as SupportedLocalesType[];

    let defaultLocale: string =
      _get(this.$plugin.config, 'files.settings/["settings.yaml"].defaultLocale') ||
      _get(this.$plugin.config, 'defaultLocale');

    // Try to get default locale from platform-specific settings.
    const settingsPath: string = joinPaths(this.$plugin.platformPath, 'settings', 'settings.yaml');
    if (existsSync(settingsPath)) {
      const settingsFile: string = readFileSync(
        joinPaths(this.$plugin.platformPath, 'settings', 'settings.yaml'),
        'utf-8',
      );
      const settings = yaml.parse(settingsFile);
      defaultLocale = _get(settings, 'defaultLocale');
    }

    if (!defaultLocale && resolvedLocales) {
      // If locales includes an english model, take english as default automatically.
      for (const locale of resolvedLocales) {
        if (locale === 'en') {
          this.$context.googleAssistant.defaultLocale = locale;
        }
      }

      // Otherwise take the first locale in the array as the default one.
      this.$context.googleAssistant.defaultLocale = resolvedLocales[0];
      return;
    }

    if (!defaultLocale) {
      throw new JovoCliError({
        message: 'Could not find a default locale.',
        module: this.$plugin.name,
        hint: 'Try adding the property "defaultLocale" to your project.js.',
      });
    }

    this.$context.googleAssistant.defaultLocale = defaultLocale;
  }

  /**
   * Try to get locale resolution (en -> en-US) from project configuration.
   * @param locale - The locale to get the resolution from.
   */
  getProjectLocales(locale: string): string[] {
    return _get(this.$plugin.config, `options.locales.${locale}`) as string[];
  }

  /**
   * Get plugin-specific endpoint.
   */
  getPluginEndpoint(): string {
    const endpoint: string =
      _get(this.$plugin.config, 'endpoint') ||
      (this.$cli.project!.config.getParameter('endpoint') as string);

    return this.$cli.resolveEndpoint(endpoint);
  }

  /**
   * Gets the invocation name for the specified locale.
   * @param locale - The locale of the Jovo model to fetch the invocation name from.
   */
  async getInvocationName(locale: string): Promise<string> {
    const { invocation } = await this.getJovoModel(locale);

    if (typeof invocation === 'object') {
      // ToDo: Test!
      const platformInvocation: string = invocation[this.$plugin.id];

      if (!platformInvocation) {
        throw new JovoCliError({
          message: `Can\'t find invocation name for locale ${locale}.`,
          module: this.$plugin.name,
        });
      }

      return platformInvocation;
    }

    return invocation;
  }

  /**
   * Parses and returns platform-specific intents and entities.
   * @param locale - Locale for which to return the model data.
   */
  getPlatformModels(locale: string): NativeFileInformation[] {
    const platformModels: NativeFileInformation[] = [];

    const modelPath: string = joinPaths(this.$plugin.platformPath, 'custom');
    // Go through a predefined set of folders to extract intent and type information.
    const foldersToInclude: string[] = ['intents', 'types', 'scenes', 'global'];

    for (const folder of foldersToInclude) {
      const path: string[] = [modelPath, folder];

      if (locale !== this.$context.googleAssistant.defaultLocale) {
        path.push(locale);
      }

      const folderPath = joinPaths(...path);

      if (!existsSync(folderPath)) {
        continue;
      }

      let files: string[] = readdirSync(joinPaths(...path));

      if (folder === 'global') {
        files = files.filter((file) => file.includes('actions.intent'));
      }

      const yamlRegex = /.*\.yaml/;
      for (const file of files) {
        if (yamlRegex.test(file)) {
          const fileContent = readFileSync(joinPaths(...path, file), 'utf-8');
          platformModels.push({
            path: [...path, file],
            content: yaml.parse(fileContent),
          });
        }
      }
    }

    return platformModels;
  }

  /**
   * Parses platform-specific settings and returns the localized invocation name.
   * @param locale - Locale for which to parse the invocation name.
   */
  getPlatformInvocationName(locale: string): string {
    const path: string[] = [this.$plugin.platformPath, 'settings'];

    if (locale !== this.$context.googleAssistant.defaultLocale) {
      path.push(locale);
    }

    const settingsPath: string = joinPaths(...path, 'settings.yaml');
    const settingsFile: string = readFileSync(settingsPath, 'utf-8');
    const settings = yaml.parse(settingsFile);

    return settings.localizedSettings.displayName;
  }

  /**
   * Returns all locales for the current platform.
   */
  getPlatformLocales(): string[] {
    const locales: string[] = [];
    const settingsPath: string = joinPaths(this.$plugin.platformPath, 'settings');
    const files: string[] = readdirSync(settingsPath);

    for (const file of files) {
      if (
        statSync(joinPaths(settingsPath, file)).isDirectory() &&
        /^[a-z]{2}-?([A-Z]{2})?$/.test(file)
      ) {
        locales.push(file);
      } else if (file === 'settings.yaml') {
        const settings = yaml.parse(readFileSync(joinPaths(settingsPath, file), 'utf-8'));
        locales.push(settings.defaultLocale);
      }
    }

    return locales;
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
      _get(this.$plugin.config, `languageModel.${locale}`, {}),
      mergeArrayCustomizer,
    );

    return model;
  }
}
