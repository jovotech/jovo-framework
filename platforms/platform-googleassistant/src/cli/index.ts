import { JovoCliPlugin, PluginHook, PluginType } from '@jovotech/cli-core';
import { join as joinPaths } from 'path';
import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { NewHook } from './hooks/NewHook';
import { GoogleCliConfig } from './utilities';

declare module '@jovotech/cli-core/dist/PluginHook' {
  export interface PluginHook {
    $plugin: GoogleAssistantCli;
  }
}

export class GoogleAssistantCli extends JovoCliPlugin {
  readonly id: string = 'googleAssistant';
  readonly type: PluginType = 'platform';
  readonly config!: GoogleCliConfig;
  readonly platformDirectory: string = 'platform.googleAssistant';

  constructor(config?: GoogleCliConfig) {
    super(config);
  }

  getHooks(): typeof PluginHook[] {
    return [BuildHook, GetHook, DeployHook, NewHook];
  }

  getDefaultConfig(): GoogleCliConfig {
    return {
      projectId: '<YOUR-PROJECT-ID-HERE>',
    };
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
