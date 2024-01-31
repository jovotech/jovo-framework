import { NewContext } from '@jovotech/cli-command-new';
import {
  JovoCliPlugin,
  Log,
  PluginHook,
  PluginType,
  promptSupportedLocales,
  RequiredOnlyWhere,
} from '@jovotech/cli-core';
import { join as joinPaths } from 'path';
import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { GoogleCliConfig, SupportedLocales, SupportedLocalesType } from './utilities';

export type GoogleCliInitConfig = RequiredOnlyWhere<GoogleCliConfig, 'projectId'>;

export class GoogleAssistantCli extends JovoCliPlugin<GoogleCliConfig> {
  constructor(config: GoogleCliInitConfig) {
    super(config);
  }

  get id(): string {
    return 'googleAssistant';
  }

  get type(): PluginType {
    return 'platform';
  }

  get platformDirectory(): string {
    return `${this.type}.${this.id}`;
  }

  getHooks(): (typeof PluginHook)[] {
    return [BuildHook, GetHook, DeployHook];
  }

  getDefaultConfig(): GoogleCliConfig {
    return { projectId: '<YOUR-PROJECT-ID>', resourcesDirectory: joinPaths('resources', this.id) };
  }

  async getInitConfig(): Promise<GoogleCliInitConfig> {
    const initConfig: GoogleCliInitConfig = { projectId: '<YOUR-PROJECT-ID>' };

    // Check for invalid locales and provide a default locale map.
    for (const locale of (this.$context as NewContext).locales) {
      if (!SupportedLocales.includes(locale as SupportedLocalesType)) {
        Log.spacer();
        // Prompt user for alternative locale.
        const { locales } = await promptSupportedLocales(
          locale,
          'GoogleAssistant',
          SupportedLocales as unknown as string[],
        );

        if (!locales.length) {
          continue;
        }

        if (!initConfig.locales) {
          initConfig.locales = {};
        }

        initConfig.locales[locale] = locales as SupportedLocalesType[];
      }
    }

    return initConfig;
  }

  get name(): string {
    return this.constructor.name;
  }

  /**
   * Returns base path to platform's build folder
   */
  get platformPath(): string {
    return joinPaths(this.$cli.project!.getBuildPath(), this.platformDirectory);
  }
}
