import { existsSync, mkdirSync, rmdirSync, writeFileSync } from 'fs';
import { join as joinPaths } from 'path';
import _merge from 'lodash.merge';
import _get from 'lodash.get';
import _has from 'lodash.has';
import _mergeWith from 'lodash.mergewith';
import _set from 'lodash.set';
import _uniq from 'lodash.uniq';
import * as yaml from 'yaml';
import {
  Task,
  JovoCliPluginContext,
  JovoCliError,
  InstallEventArguments,
  printStage,
  printSubHeadline,
  ParseEventArguments,
  OK_HAND,
  STATION,
  PluginHook,
  JovoCli,
  wait,
  mergeArrayCustomizer,
  flags,
  deleteFolderRecursive,
} from '@jovotech/cli-core';
import { BuildEvents } from '@jovotech/cli-command-build';
import { FileBuilder, FileObject } from '@jovotech/filebuilder';
import { JovoModelData, NativeFileInformation } from 'jovo-model';
import { JovoModelGoogle } from 'jovo-model-google';

import defaultFiles from '../utils/DefaultFiles.json';
import {
  GoogleActionActions,
  GoogleActionProjectLocales,
  getPlatformDirectory,
  getPlatformPath,
  PluginContextGoogle,
} from '../utils';

export interface BuildPluginContextGoogle extends PluginContextGoogle {
  defaultLocale?: string;
  projectLocales?: GoogleActionProjectLocales;
}

export class BuildHook extends PluginHook<BuildEvents> {
  install() {
    this.actionSet = {
      'install': [this.addCliOptions.bind(this)],
      'parse': [this.checkForPlatform.bind(this)],
      'before.build': [
        this.updatePluginContext.bind(this),
        this.validateModels.bind(this),
        this.checkForCleanBuild.bind(this),
      ],
      'build': [this.build.bind(this)],
      'reverse.build': [this.buildReverse.bind(this)],
    };
  }

  addCliOptions(args: InstallEventArguments) {
    if (args.command !== 'build') {
      return;
    }

    args.flags['project-id'] = flags.string({
      description: 'Google Cloud Project ID',
    });
  }

  checkForPlatform(args: ParseEventArguments) {
    // Check if this plugin should be used or not.
    if (args.flags.platform && args.flags.platform !== this.$config.pluginId!) {
      this.uninstall();
    }
  }

  /**
   * Updates the current context with plugin-specific values from --project-id.
   * @param context - Plugin context.
   */
  updatePluginContext(context: BuildPluginContextGoogle) {
    if (context.command !== 'build') {
      return;
    }

    context.projectId = context.flags['project-id'] || _get(this.$config, 'projectId');
  }

  async validateModels(context: JovoCliPluginContext) {
    const jovo: JovoCli = JovoCli.getInstance();

    // Validate Jovo model.
    const validationTask: Task = new Task(`${OK_HAND} Validating Google Assistant model files`);

    for (const locale of context.locales) {
      const localeTask = new Task(locale, async () => {
        jovo.$project!.validateModel(locale, JovoModelGoogle.getValidator());
        await wait(500);
      });

      validationTask.add(localeTask);
    }

    await validationTask.run();
  }

  checkForCleanBuild(context: JovoCliPluginContext) {
    // If --clean has been set, delete the respective platform folders before building.
    if (context.flags.clean) {
      deleteFolderRecursive(getPlatformPath());
    }
  }

  /**
   * Main build function.
   * @param context - Plugin Context.
   */
  async build(context: BuildPluginContextGoogle) {
    const jovo: JovoCli = JovoCli.getInstance();
    const taskStatus: string = jovo.$project!.hasPlatform(getPlatformDirectory())
      ? 'Updating'
      : 'Creating';

    const buildTaskTitle = `${STATION} ${taskStatus} Google Conversational Action project files${printStage(
      jovo.$project!.$stage,
    )}\n${printSubHeadline(
      `Path: ./${jovo.$project!.getBuildDirectory()}/${getPlatformDirectory()}`,
    )}`;
    // Define main build task.
    const buildTask: Task = new Task(buildTaskTitle);

    // Build context object by fetching projectLocales and defaultLocale.
    context.defaultLocale = this.getDefaultLocale(context.locales);
    context.projectLocales = this.resolveProjectLocales(context.locales);

    // Update or create Google Conversational Action project files, depending on whether it has already been built or not.
    const projectFilesTask: Task = new Task(
      `${taskStatus} Project Files`,
      this.createGoogleProjectFiles.bind(this, context),
    );

    const buildInteractionModelTask: Task = new Task(
      `${taskStatus} Interaction Model`,
      this.createInteractionModel(context),
    );
    // If no model files for the current locales exist, do not build interaction model.
    if (!jovo.$project!.hasModelFiles(context.locales)) {
      buildInteractionModelTask.disable();
    }

    buildTask.add(projectFilesTask, buildInteractionModelTask);

    await buildTask.run();
  }

  /**
   * Creates Google Conversational Action specific project files.
   * @param context - Plugin Context.
   */
  createGoogleProjectFiles(context: BuildPluginContextGoogle) {
    const jovo: JovoCli = JovoCli.getInstance();
    const files: FileObject = FileBuilder.normalizeFileObject(_get(this.$config, 'files', {}));
    // If platforms folder doesn't exist, take default files and parse them with project.js config into FileBuilder.
    const projectFiles: FileObject = jovo.$project!.hasPlatform(getPlatformDirectory())
      ? files
      : _merge(defaultFiles, files);
    // Get default locale.
    // Merge global project.js properties with platform files.
    // Set endpoint.
    const endpoint: string = this.getPluginEndpoint();
    const webhookPath: string = 'webhooks/["ActionsOnGoogleFulfillment.yaml"]';

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
    for (const [modelLocale, resolvedLocales] of Object.entries(context.projectLocales!)) {
      for (const locale of resolvedLocales) {
        const settingsPathArr: string[] = ['settings/'];

        if (locale !== context.defaultLocale!) {
          settingsPathArr.push(`${locale}/`);
        }

        settingsPathArr.push('["settings.yaml"]');

        const settingsPath: string = settingsPathArr.join('.');

        // Set default settings.
        if (locale === context.defaultLocale!) {
          if (!_has(projectFiles, `${settingsPath}.defaultLocale`)) {
            _set(projectFiles, `${settingsPath}.defaultLocale`, context.defaultLocale!);
          }

          if (!_has(projectFiles, `${settingsPath}.projectId`)) {
            _set(projectFiles, `${settingsPath}.projectId`, context.projectId);
          }
        }

        // Set minimal required localized settings, such as displayName and pronunciation.
        const localizedSettingsPath: string = `${settingsPath}.localizedSettings`;

        const invocationName: string = this.getInvocationName(modelLocale);
        if (!_has(projectFiles, `${localizedSettingsPath}.displayName`)) {
          _set(projectFiles, `${localizedSettingsPath}.displayName`, invocationName);
        }
        if (!_has(projectFiles, `${localizedSettingsPath}.pronunciation`)) {
          _set(projectFiles, `${localizedSettingsPath}.pronunciation`, invocationName);
        }
      }
    }

    FileBuilder.buildDirectory(projectFiles, getPlatformPath());
  }

  /**
   * Creates and returns tasks for each locale to build the interaction model for Google Assistant.
   * @param context - JovoCliPluginContext, containing context-sensitive information such as what locales to use.
   */
  createInteractionModel(context: BuildPluginContextGoogle): Task[] {
    const tasks: Task[] = [];
    for (const [modelLocale, resolvedLocales] of Object.entries(context.projectLocales!)) {
      for (const locale of resolvedLocales) {
        const localeTask: Task = new Task(locale, async () => {
          this.buildLanguageModel(modelLocale, locale, context.defaultLocale!);
          await wait(500);
        });
        tasks.push(localeTask);
      }
    }
    return tasks;
  }

  /**
   * Builds and saves Google Conversational Action model from Jovo model.
   * @param {string} locale
   * @param {string} stage
   */
  buildLanguageModel(modelLocale: string, resolvedLocale: string, defaultLocale: string) {
    const model = this.getModel(modelLocale);
    const jovoModel = new JovoModelGoogle(model, resolvedLocale, defaultLocale);
    const modelFiles: NativeFileInformation[] = jovoModel.exportNative()!;

    const actions: GoogleActionActions = {
      custom: {
        'actions.intent.MAIN': {},
      },
    };

    for (const file of modelFiles) {
      const fileName = file.path.pop()!;
      const modelPath = joinPaths(getPlatformPath(), ...file.path);

      // Check if the path for the current model type (e.g. intent, types, ...) exists.
      if (!existsSync(modelPath)) {
        mkdirSync(modelPath, { recursive: true });
      }

      // Register actions.
      if (file.path.includes('intents')) {
        actions.custom[fileName.replace('.yaml', '')] = {};
      }

      writeFileSync(joinPaths(modelPath, fileName), file.content);
    }

    // Merge existing actions file with configuration in project.js.
    _merge(actions, this.getProjectActions());

    const actionsPath: string = joinPaths(getPlatformPath(), 'actions');
    if (!existsSync(actionsPath)) {
      mkdirSync(actionsPath, { recursive: true });
    }
    writeFileSync(joinPaths(actionsPath, 'actions.yaml'), yaml.stringify(actions));
  }

  /**
   * Gets configured actions from project.js
   */
  getProjectActions() {
    const actions = _get(this.$config, 'options.actions/');
    return actions;
  }

  /**
   * Gets the default locale for the current Conversational Action.
   * @param locales - An optional array of locales to choose the default locale from, if provided.
   */
  getDefaultLocale(locales?: string[]): string {
    const defaultLocale: string =
      _get(this.$config, 'files.settings/["settings.yaml"].defaultLocale') ||
      _get(this.$config, 'defaultLocale');

    if (!defaultLocale && locales) {
      // If locales includes an english model, take english as default automatically.
      for (const locale of locales) {
        if (locale.includes('en')) {
          return 'en';
        }
      }

      // Get default locale from Jovo Models.
      return locales[0].substring(0, 2);
    }

    if (!defaultLocale) {
      throw new JovoCliError(
        'Could not find a default locale.',
        this.$config.pluginName!,
        'Try adding the property "defaultLocale" to your project.js.',
      );
    }

    return defaultLocale;
  }

  /**
   * Resolves project locales. Since Google Conversational Actions require at least one specific locale (e.g. en-US for en),
   * we need to resolve any generic locales to more specific ones.
   * @param locales - Locales to resolve.
   */
  resolveProjectLocales(locales: string[]): GoogleActionProjectLocales {
    const projectLocales: GoogleActionProjectLocales = {};

    // Get project locales to build.
    // Since Google Conversational Actions require at least one specific locale (e.g. en-US for en),
    // we need to resolve any generic locales to more specific ones.
    for (const locale of locales) {
      const localePrefix = locale.substring(0, 2);
      const locales: string[] = this.getProjectLocales(locale) || [];
      // Add the main locale to the array of locales, as well as the locale prefix.
      locales.unshift(locale);
      locales.unshift(localePrefix);

      // Unify locales to remove duplicates.
      projectLocales[locale] = _uniq(locales);
    }

    return projectLocales;
  }

  /**
   * Try to get locale resolution (en -> en-US) from project.js.
   * @param locale - The locale to get the resolution from.
   */
  getProjectLocales(locale: string): string[] {
    return _get(this.$config, `options.locales.${locale}`) as string[];
  }

  /**
   * Returns the project id for the Google Conversational Action.
   * @param context - Plugin Context.
   */
  getProjectId(context: JovoCliPluginContext): string {
    const projectId: string = context.flags?.projectId || _get(this.$config, 'projectId');
    return projectId;
  }

  /**
   * Get plugin-specific endpoint.
   */
  getPluginEndpoint(): string {
    const jovo: JovoCli = JovoCli.getInstance();
    const config = jovo.$project!.$config.get();
    const endpoint = _get(this.$config, 'endpoint') || _get(config, 'endpoint');

    return jovo.resolveEndpoint(endpoint);
  }

  /**
   * Gets the invocation name for the specified locale.
   * @param locale - The locale of the Jovo model to fetch the invocation name from.
   */
  getInvocationName(locale: string): string {
    const { invocation } = this.getModel(locale);

    if (typeof invocation === 'object') {
      const platformInvocation: string = invocation[this.$config.pluginName!];

      if (!platformInvocation) {
        throw new JovoCliError(
          `Can\'t find invocation name for locale ${locale}.`,
          this.$config.pluginName!,
        );
      }

      return platformInvocation;
    }

    return invocation;
  }

  /**
   * Loads a Jovo model specified by a locale and merges it with plugin-specific models.
   * @param locale - The locale that specifies which model to load.
   */
  getModel(locale: string): JovoModelData {
    const jovo: JovoCli = JovoCli.getInstance();
    const model: JovoModelData = jovo.$project!.getModel(locale);

    // Merge model with configured language model in project.js.
    _mergeWith(
      model,
      jovo.$project!.$config.getParameter(`languageModel.${locale}`) || {},
      mergeArrayCustomizer,
    );
    // Merge model with configured, platform-specific language model in project.js.
    _mergeWith(model, _get(this.$config, `languageModel.${locale}`, {}), mergeArrayCustomizer);

    return model;
  }

  /**
   * Builds Jovo model files from platform-specific files.
   * @param context
   */
  async buildReverse(context: JovoCliPluginContext) {
    const reverseBuildTask: Task = new Task('Reversing model files', () => {
      // ToDo: Implement!
    });

    await reverseBuildTask.run();
  }
}
