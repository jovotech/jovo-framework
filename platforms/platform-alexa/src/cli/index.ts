import type { NewContext } from '@jovotech/cli-command-new';
import {
  JovoCliPlugin,
  Log,
  PluginHook,
  PluginType,
  promptSupportedLocales,
} from '@jovotech/cli-core';
import { join as joinPaths } from 'path';
import { SupportedLocales } from './constants';
import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { NewHook } from './hooks/NewHook';
import { AlexaCliConfig, SupportedLocalesType } from './interfaces';

export class AlexaCli extends JovoCliPlugin<AlexaCliConfig> {
  readonly id: string = 'alexa';
  readonly type: PluginType = 'platform';
  readonly platformDirectory: string = 'platform.alexa';

  async getInitConfig(): Promise<AlexaCliConfig> {
    const initConfig: AlexaCliConfig = {};
    // Check for invalid locales and provide a default locale map.
    for (const locale of (this.$context as NewContext).locales) {
      if (!SupportedLocales.includes(locale as SupportedLocalesType)) {
        // Prompt user for alternative locale.
        Log.spacer();
        const { locales } = await promptSupportedLocales(
          locale,
          'Alexa',
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

  getHooks(): typeof PluginHook[] {
    return [BuildHook, GetHook, DeployHook, NewHook];
  }

  /**
   * The base path to platform's build folder
   */
  get platformPath(): string {
    return joinPaths(this.$cli.project!.getBuildPath(), this.platformDirectory);
  }

  /**
   * The path to Alexa skill package folder
   */
  get skillPackagePath(): string {
    return joinPaths(this.platformPath, 'skill-package');
  }

  /**
   * The path to the skill.json file
   */
  get skillJsonPath(): string {
    return joinPaths(this.skillPackagePath, 'skill.json');
  }

  get modelsPath(): string {
    return joinPaths(this.skillPackagePath, 'interactionModels', 'custom');
  }

  get accountLinkingPath(): string {
    return joinPaths(this.skillPackagePath, 'accountLinking.json');
  }

  get askConfigFolderPath(): string {
    return joinPaths(this.platformPath, '.ask');
  }

  get askConfigPath(): string {
    return joinPaths(this.askConfigFolderPath, 'ask-states.json');
  }

  get askResourcesPath(): string {
    return joinPaths(this.platformPath, 'ask-resources.json');
  }

  getModelPath(locale: string): string {
    return joinPaths(this.modelsPath, `${locale}.json`);
  }
}
