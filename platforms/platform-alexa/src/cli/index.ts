import { join as joinPaths } from 'path';
import { JovoCliPlugin, PluginHook, PluginType } from '@jovotech/cli-core';
import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { NewHook } from './hooks/NewHook';
import { AlexaCliConfig } from './utils/Interfaces';

export class AlexaCli extends JovoCliPlugin {
  readonly $id: string = 'alexaSkill';
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

  /**
   * Returns base path to platform's build folder.
   */
  getPlatformPath(): string {
    return joinPaths(this.$cli.$project!.getBuildPath(), this.platformDirectory);
  }

  /**
   * Returns path to Alexa skill package folder.
   */
  getSkillPackagePath(): string {
    return joinPaths(this.getPlatformPath(), 'skill-package');
  }

  /**
   * Returns path to skill.json.
   */
  getSkillJsonPath(): string {
    return joinPaths(this.getSkillPackagePath(), 'skill.json');
  }

  getModelsPath(): string {
    return joinPaths(this.getSkillPackagePath(), 'interactionModels', 'custom');
  }

  getModelPath(locale: string): string {
    return joinPaths(this.getModelsPath(), `${locale}.json`);
  }

  getAccountLinkingPath(): string {
    return joinPaths(this.getSkillPackagePath(), 'accountLinking.json');
  }

  getAskConfigFolderPath(): string {
    return joinPaths(this.getPlatformPath(), '.ask');
  }

  getAskConfigPath(): string {
    return joinPaths(this.getAskConfigFolderPath(), 'ask-states.json');
  }
}
