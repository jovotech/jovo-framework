import { JovoCliPlugin, PluginHook, PluginType } from '@jovotech/cli-core';
import { join as joinPaths } from 'path';
import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { NewHook } from './hooks/NewHook';
import { AlexaCliConfig } from './interfaces';

export class AlexaCli extends JovoCliPlugin {
  readonly $id: string = 'alexa';
  readonly $type: PluginType = 'platform';
  readonly $config!: AlexaCliConfig;
  readonly platformDirectory: string = 'platform.alexa';

  constructor(config: AlexaCliConfig) {
    super(config);
  }

  getHooks(): typeof PluginHook[] {
    // console.log(this.$id);
    return [BuildHook, GetHook, DeployHook, NewHook];
  }

  get name(): string {
    return this.constructor.name;
  }

  /**
   * The base path to platform's build folder
   */
  get platformPath(): string {
    return joinPaths(this.$cli.$project!.getBuildPath(), this.platformDirectory);
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

  getModelPath(locale: string): string {
    return joinPaths(this.modelsPath, `${locale}.json`);
  }
}
