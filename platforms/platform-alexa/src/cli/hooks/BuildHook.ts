import type { BuildPlatformContext, BuildPlatformEvents } from '@jovotech/cli-command-build';
import {
  ANSWER_BACKUP,
  ANSWER_CANCEL,
  deleteFolderRecursive,
  DISK,
  flags,
  getResolvedLocales,
  InstallContext,
  isJovoCliError,
  JovoCliError,
  Log,
  mergeArrayCustomizer,
  OK_HAND,
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
import { JovoModelAlexa } from '@jovotech/model-alexa';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { copySync, moveSync } from 'fs-extra';
import _get from 'lodash.get';
import _has from 'lodash.has';
import _merge from 'lodash.merge';
import _mergeWith from 'lodash.mergewith';
import _set from 'lodash.set';
import { join as joinPaths } from 'path';
import { SupportedLocales } from '../constants';
import DefaultFiles from '../DefaultFiles.json';
import { AlexaContext, SupportedLocalesType } from '../interfaces';
import { AlexaHook } from './AlexaHook';

export interface AlexaBuildPlatformContext extends AlexaContext, BuildPlatformContext {
  flags: BuildPlatformContext['flags'] & { 'ask-profile'?: string };
}

export class BuildHook extends AlexaHook<BuildPlatformEvents> {
  $context!: AlexaBuildPlatformContext;

  install(): void {
    this.middlewareCollection = {
      'install': [this.addCliOptions.bind(this)],
      'before.build:platform': [
        this.updatePluginContext.bind(this),
        this.checkForPlatform.bind(this),
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

    context.flags['ask-profile'] = flags.string({
      description: 'Name of used ASK profile',
    });
  }

  /**
   * Updates the current plugin context with platform-specific values.
   */
  updatePluginContext(): void {
    super.updatePluginContext();

    this.$context.alexa.askProfile =
      this.$context.flags['ask-profile'] || this.$plugin.config.askProfile || 'default';
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
   * Checks if any provided locale is not supported, thus invalid.
   */
  validateLocales(): void {
    for (const locale of this.$context.locales) {
      const resolvedLocales = getResolvedLocales(
        locale,
        SupportedLocales,
        this.$plugin.config.locales,
      );

      for (const resolvedLocale of resolvedLocales) {
        if (!SupportedLocales.includes(resolvedLocale as SupportedLocalesType)) {
          throw new JovoCliError({
            message: `Locale ${printHighlight(resolvedLocale)} is not supported by Amazon Alexa.`,
            module: this.$plugin.name,
            hint:
              resolvedLocale.length === 2
                ? 'Alexa does not support generic locales, please specify locales in your project configuration.'
                : '',
            learnMore: 'https://www.jovo.tech/marketplace/platform-alexa/project-config#locales',
          });
        }
      }
    }
  }

  /**
   * Validates Jovo models with platform-specific validators.
   */
  async validateModels(): Promise<void> {
    // Validate Jovo model
    const validationTask: Task = new Task(`${OK_HAND} Validating Alexa model files`);

    for (const locale of this.$context.locales) {
      const localeTask = new Task(locale, async () => {
        const model: JovoModelData | JovoModelDataV3 = await this.$cli.project!.getModel(locale);
        await this.$cli.project!.validateModel(
          locale,
          model,
          JovoModelAlexa.getValidator(model),
          this.$plugin.name,
        );
        await wait(500);
      });

      validationTask.add(localeTask);
    }

    await validationTask.run();
  }

  /**
   * Checks if --clean has been set and deletes the platform folder accordingly
   */
  checkForCleanBuild(): void {
    // If --clean has been set, delete the respective platform folders before building
    if (this.$context.flags.clean) {
      deleteFolderRecursive(this.$plugin.platformPath);
    }
  }

  async build(): Promise<void> {
    const buildPath = `Path: ./${joinPaths(
      this.$cli.project!.getBuildDirectory(),
      this.$plugin.platformDirectory,
    )}`;

    const buildTaskTitle = `${STATION} Building Alexa Skill files${printStage(
      this.$cli.project!.stage,
    )}\n${printSubHeadline(buildPath)}`;

    // Define main build task.
    const buildTask: Task = new Task(buildTaskTitle);

    // Update or create Alexa project files, depending on whether it has already been built or not.
    const projectFilesTask: Task = new Task(`Project files`, this.buildProjectFiles.bind(this));

    const interactionModelTask: Task = new Task(
      `Interaction model`,
      this.buildInteractionModel.bind(this),
      {
        enabled:
          this.$cli.project!.config.getParameter('models.enabled') !== false &&
          this.$cli.project!.hasModelFiles(this.$context.locales),
      },
    );

    const buildConversationFilesTask: Task = new Task(
      `Alexa Conversations files`,
      this.buildConversationsFiles.bind(this),
      { enabled: this.$context.alexa.isACSkill },
    );

    const buildResponseFilesTask: Task = new Task(
      `Response files`,
      this.buildResponseFiles.bind(this),
      { enabled: this.$context.alexa.isACSkill },
    );

    buildTask.add(
      interactionModelTask,
      projectFilesTask,
      buildConversationFilesTask,
      buildResponseFilesTask,
    );

    await buildTask.run();
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

    const reverseBuildTask: Task = new Task(`${REVERSE_ARROWS} Reversing Alexa files`);

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

      // If Jovo model files for the current locales or resource files exist, ask whether to back them up or not.
      if (
        this.$cli.project!.hasModelFiles(Object.values(buildLocaleMap)) ||
        (this.$context.alexa.isACSkill && existsSync(this.$plugin.resourcesDirectory))
      ) {
        const answer = await promptOverwriteReverseBuild();
        if (answer.overwrite === ANSWER_CANCEL) {
          return;
        }
        if (answer.overwrite === ANSWER_BACKUP) {
          Log.spacer();
          // Backup old files.
          const backupTask: Task = new Task(`${DISK} Creating backups`);
          const date: string = new Date().toISOString();

          if (existsSync(this.$cli.project!.getModelsDirectory())) {
            const modelsBackupDirectory = `${this.$cli.project!.getModelsDirectory()}.${date}`;
            const modelTask: Task = new Task(
              `${this.$cli.project!.getModelsDirectory()} -> ${modelsBackupDirectory}`,
              () => {
                moveSync(this.$cli.project!.getModelsDirectory(), modelsBackupDirectory, {
                  overwrite: true,
                });
              },
            );
            backupTask.add(modelTask);
          }

          if (existsSync(this.$plugin.resourcesDirectory)) {
            const resourcesBackupDirectory = `${this.$plugin.resourcesDirectory}.${date}`;
            const resourcesTask: Task = new Task(
              `${this.$plugin.resourcesDirectory} -> ${resourcesBackupDirectory}`,
              () => {
                moveSync(this.$plugin.resourcesDirectory, resourcesBackupDirectory, {
                  overwrite: true,
                });
              },
            );
            backupTask.add(resourcesTask);
          }

          await backupTask.run();
        }
      }

      for (const [platformLocale, modelLocale] of Object.entries(buildLocaleMap)) {
        const taskDetails: string = platformLocale === modelLocale ? '' : `(${modelLocale})`;
        const localeTask: Task = new Task(`${platformLocale} ${taskDetails}`, async () => {
          const alexaModelFiles: NativeFileInformation[] = [
            {
              path: [],
              content: this.getPlatformModel(platformLocale),
            },
          ];
          const jovoModel = new JovoModelAlexa();
          jovoModel.importNative(alexaModelFiles, modelLocale);
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
        reverseBuildTask.add(localeTask);
      }
    }

    if (this.$context.alexa.isACSkill && this.$plugin.config.conversations?.directory) {
      if (
        this.$plugin.config.conversations?.acdlDirectory &&
        existsSync(this.$plugin.conversationsDirectory)
      ) {
        const acdlPath: string = joinPaths(
          this.$plugin.config.conversations.directory,
          this.$plugin.config.conversations.acdlDirectory,
        );

        const copyAcdlFilesTask: Task = new Task(
          `Copying Alexa Conversations files into ${acdlPath}`,
          () => copySync(this.$plugin.conversationsDirectory, acdlPath),
        );
        reverseBuildTask.add(copyAcdlFilesTask);
      }

      if (
        this.$plugin.config.conversations?.responsesDirectory &&
        existsSync(this.$plugin.responseDirectory)
      ) {
        const responsesPath: string = joinPaths(
          this.$plugin.config.conversations.directory,
          this.$plugin.config.conversations.responsesDirectory,
        );

        const copyResponseFilesTask: Task = new Task(
          `Copying Response files into ${responsesPath}`,
          () => copySync(this.$plugin.responseDirectory, responsesPath),
        );
        reverseBuildTask.add(copyResponseFilesTask);
      }
    }

    await reverseBuildTask.run();
  }

  /**
   * Builds the Alexa skill manifest.
   */
  buildProjectFiles(): void {
    const files: FileObject = FileBuilder.normalizeFileObject(
      _get(this.$plugin.config, 'files', {}),
    );

    // If platforms folder doesn't exist, take default files and parse them with project.js config into FileBuilder.
    const projectFiles: FileObject = this.$cli.project!.hasPlatform(this.$plugin.platformDirectory)
      ? files
      : _merge(DefaultFiles, files);

    // Merge global project.js properties with platform files.
    const endpoint: string = this.getPluginEndpoint();
    const endpointPath = 'skill-package/["skill.json"].manifest.apis.custom.endpoint';
    // If a global endpoint is given and one is not already specified, set the global one.
    if (!_has(projectFiles, endpointPath)) {
      // If endpoint is of type ARN, omit the Wildcard certificate.
      const certificate: string | null = !endpoint.startsWith('arn') ? 'Wildcard' : null;
      // Create basic HTTPS endpoint from Wildcard SSL.
      _set(projectFiles, endpointPath, {
        sslCertificateType: certificate,
        uri: endpoint,
      });
    }

    // replace ${JOVO_WEBHOOK_URL} in event uri with the Jovo Webhook url
    const eventEndpointUriPath = 'skill-package/["skill.json"].manifest.events.endpoint.uri';
    if (_has(projectFiles, eventEndpointUriPath)) {
      _set(
        projectFiles,
        eventEndpointUriPath,
        this.$cli.resolveEndpoint(_get(projectFiles, eventEndpointUriPath).toString()),
      );
    }

    // Create entries for Alexa Conversations
    const conversationsPath = 'skill-package/["skill.json"].manifest.apis.custom.dialogManagement';
    if (this.$context.alexa.isACSkill && !_has(projectFiles, conversationsPath)) {
      _set(projectFiles, conversationsPath, {
        sessionStartDelegationStrategy: {
          target: this.$plugin.config.conversations?.sessionStartDelegationStrategy?.target,
        },
        dialogManagers: [
          {
            type: 'AMAZON.Conversations',
          },
        ],
      });
    }

    // Create ask profile entry
    const askResourcesPath = `["ask-resources.json"].profiles.${this.$context.alexa.askProfile}`;
    if (!_has(projectFiles, askResourcesPath)) {
      _set(projectFiles, askResourcesPath, {
        skillMetadata: {
          src: './skill-package',
        },
      });
    }

    const askConfigPath = `[".ask/"].["ask-states.json"].profiles.${this.$context.alexa.askProfile}`;
    const skillId: string | undefined = this.$plugin.config.skillId;
    const skillIdPath = `${askConfigPath}.skillId`;
    // Check whether skill id has already been set.
    if (skillId && !_has(projectFiles, skillIdPath)) {
      _set(projectFiles, skillIdPath, skillId);
    }

    const skillName: string = this.$cli.project!.getProjectName();
    const locales: string[] = this.$context.locales.reduce((locales: string[], locale: string) => {
      locales.push(...getResolvedLocales(locale, SupportedLocales, this.$plugin.config.locales));
      return locales;
    }, []);

    for (const locale of locales) {
      // Check whether publishing information has already been set.
      const publishingInformationPath = `skill-package/["skill.json"].manifest.publishingInformation.locales.${locale}`;
      if (!_has(projectFiles, publishingInformationPath)) {
        _set(projectFiles, publishingInformationPath, {
          summary: 'Sample Short Description',
          examplePhrases: ['Alexa open hello world'],
          keywords: ['hello', 'world'],
          name: skillName,
          description: 'Sample Full Description',
          smallIconUri: 'https://via.placeholder.com/108/09f/09f.png',
          largeIconUri: 'https://via.placeholder.com/512/09f/09f.png',
        });
      }

      const privacyAndCompliancePath = `skill-package/["skill.json"].manifest.privacyAndCompliance.locales.${locale}`;
      // Check whether privacy and compliance information has already been set.
      if (!_has(projectFiles, privacyAndCompliancePath)) {
        _set(projectFiles, privacyAndCompliancePath, {
          privacyPolicyUrl: 'http://example.com/policy',
          termsOfUseUrl: '',
        });
      }
    }

    FileBuilder.buildDirectory(projectFiles, this.$plugin.platformPath);
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
   * Builds and saves an Alexa model from a Jovo model.
   * @param modelLocale - Locale of the Jovo model.
   * @param resolvedLocales - Locales to which to resolve the modelLocale.
   */
  async buildLanguageModel(modelLocale: string, resolvedLocales: string[]): Promise<void> {
    const model = _merge(
      await this.getJovoModel(modelLocale),
      this.$cli.project!.config.getParameter(`models.override.${modelLocale}`),
    );

    try {
      for (const locale of resolvedLocales) {
        const jovoModel: JovoModelAlexa = new JovoModelAlexa(model as JovoModelData, locale);
        const alexaModelFiles: NativeFileInformation[] =
          jovoModel.exportNative() as NativeFileInformation[];

        if (!alexaModelFiles || !alexaModelFiles.length) {
          // Should actually never happen but who knows
          throw new JovoCliError({
            message: `Could not build Alexa files for locale "${locale}"!`,
            module: this.$plugin.name,
          });
        }

        const modelsPath: string = this.$plugin.modelsPath;
        if (!existsSync(modelsPath)) {
          mkdirSync(modelsPath, { recursive: true });
        }

        writeFileSync(
          this.$plugin.getModelPath(locale),
          JSON.stringify(alexaModelFiles[0].content, null, 2),
        );
      }
    } catch (error) {
      if (!isJovoCliError(error)) {
        throw new JovoCliError({ message: error.message, module: this.$plugin.name });
      }
      throw error;
    }
  }

  buildConversationsFiles(): void {
    const src: string = joinPaths(
      this.$plugin.config.conversations!.directory!,
      this.$plugin.config.conversations!.acdlDirectory!,
    );

    if (!existsSync(src)) {
      throw new JovoCliError({
        message: `Directory for Alexa Conversations files does not exist at ${src}`,
        module: this.$plugin.name,
        hint: `Try creating your .acdl files in ${src} or specify the directory of your choice in the project configuration`,
      });
    }

    copySync(src, this.$plugin.conversationsDirectory);
  }

  buildResponseFiles(): void {
    const src: string = joinPaths(
      this.$plugin.config.conversations!.directory!,
      this.$plugin.config.conversations!.responsesDirectory!,
    );

    if (!existsSync(src)) {
      throw new JovoCliError({
        message: `Directory for Alexa response files does not exist at ${src}`,
        module: this.$plugin.name,
        hint: `Try creating your APL-A response files in ${src} or specify the directory of your choice in the project configuration`,
      });
    }

    copySync(src, this.$plugin.responseDirectory);
  }

  /**
   * Get plugin-specific endpoint.
   */
  getPluginEndpoint(): string {
    const endpoint: string =
      _get(this.$plugin.config, 'endpoint') ||
      (this.$cli.project!.config.getParameter('endpoint') as string);

    if (!endpoint) {
      throw new JovoCliError({
        message: 'endpoint has to be set',
        hint: 'Try setting your endpoint in the project configuration',
        learnMore: 'https://www.jovo.tech/docs/project-config#endpoint',
      });
    }

    return this.$cli.resolveEndpoint(endpoint);
  }

  /**
   * Loads a platform-specific model.
   * @param locale - Locale of the model.
   */
  getPlatformModel(locale: string): JovoModelData {
    const content: string = readFileSync(this.$plugin.getModelPath(locale), 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Returns all locales for the current platform.
   */
  getPlatformLocales(): string[] {
    const files: string[] = readdirSync(this.$plugin.modelsPath);

    if (!existsSync(this.$plugin.modelsPath)) {
      throw new JovoCliError({
        message: 'Could not find Alexa language models',
        details: `"${this.$plugin.modelsPath}" does not exist`,
        hint: 'Please validate that you configured the "buildDirectory" or "stage" correctly',
      });
    }
    // Map each file to it's identifier, without file extension.
    return files.map((file: string) => {
      const localeRegex = /(.*)\.(?:[^.]+)$/;
      const match = localeRegex.exec(file);

      // ToDo: Test!
      if (!match) {
        return file;
      }

      return match[1];
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
