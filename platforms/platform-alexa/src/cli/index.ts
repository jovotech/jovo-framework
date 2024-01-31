import type { NewContext } from '@jovotech/cli-command-new';
import {
  JovoCliPlugin,
  Log,
  PluginHook,
  PluginType,
  promptSupportedLocales,
  RequiredOnlyWhere,
} from '@jovotech/cli-core';
import { writeFileSync } from 'fs';
import { join as joinPaths, resolve } from 'path';
import { SupportedLocales } from './constants';
import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { NewHook } from './hooks/NewHook';
import { AlexaCliConfig, AlexaConversationsConfig, SupportedLocalesType } from './interfaces';

export type AlexaCliInitConfig =
  | RequiredOnlyWhere<AlexaCliConfig, 'conversations.enabled'>
  | { conversations: boolean };

export class AlexaCli extends JovoCliPlugin<AlexaCliConfig> {
  constructor(config?: AlexaCliInitConfig) {
    super(config as AlexaCliConfig);

    // Convert boolean value of this.config.conversations to object to handle it unified across hooks
    if (typeof this.config.conversations === 'boolean') {
      const { conversations: defaultConversationsConfig } = this.getDefaultConfig();
      this.config.conversations = {
        ...(defaultConversationsConfig as AlexaConversationsConfig),
        enabled: this.config.conversations,
      };
    }
  }

  get id(): string {
    return 'alexa';
  }

  get type(): PluginType {
    return 'platform';
  }

  get platformDirectory(): string {
    return `${this.type}.${this.id}`;
  }

  getDefaultConfig(): AlexaCliConfig {
    return {
      conversations: {
        enabled: false,
        // ! Since getDefaultConfig() is called before this.id is assigned, we need to set it manually
        directory: joinPaths('resources', 'alexa', 'conversations'),
        sessionStartDelegationStrategy: {
          target: 'skill',
        },
        acdlDirectory: 'acdl',
        responsesDirectory: 'responses',
        skipValidation: false,
      },
    };
  }

  async getInitConfig(): Promise<AlexaCliConfig> {
    const initConfig: AlexaCliConfig = {};

    // Since this.getInitConfig() is called when this plugin is added to a new
    // Jovo project, we can add external bundle dependencies here
    const packageJsonPath: string = resolve(
      joinPaths(this.$cli.projectPath, (this.$context as NewContext).projectName, 'package.json'),
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(packageJsonPath);
    packageJson.scripts.bundle = `${packageJson.scripts.bundle} --external:@alexa/*`;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

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

  getHooks(): (typeof PluginHook)[] {
    return [BuildHook, GetHook, DeployHook, NewHook];
  }

  /**
   * The base path to platform's build folder
   */
  get platformPath(): string {
    return joinPaths(this.$cli.project!.getBuildPath(), this.platformDirectory);
  }

  get resourcesDirectory(): string {
    return joinPaths('resources', this.id);
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

  get conversationsDirectory(): string {
    return joinPaths(this.skillPackagePath, 'conversations');
  }

  get responseDirectory(): string {
    return joinPaths(this.skillPackagePath, 'response');
  }

  getModelPath(locale: string): string {
    return joinPaths(this.modelsPath, `${locale}.json`);
  }
}
