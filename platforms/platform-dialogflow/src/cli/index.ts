import { JovoCliPlugin, PluginHook, PluginType } from '@jovotech/cli-core';
import { join as joinPaths } from 'path';

import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { DialogflowConfig } from './utils';

export class DialogflowCli extends JovoCliPlugin {
  readonly $id: string = 'dialogflow';
  readonly $type: PluginType = 'platform';
  readonly $config!: DialogflowConfig;
  readonly platformDirectory: string = 'platform.dialogflow';

  constructor(config?: DialogflowConfig) {
    super(config);
  }

  getHooks(): typeof PluginHook[] {
    return [BuildHook, DeployHook, GetHook];
  }

  getPlatformPath(): string {
    return joinPaths(this.$cli.$project!.getBuildPath(), this.platformDirectory);
  }

  getAgentJsonPath(): string {
    return joinPaths(this.getPlatformPath(), 'agent.json');
  }

  getPackageJsonPath(): string {
    return joinPaths(this.getPlatformPath(), 'package.json');
  }

  getIntentsFolderPath(): string {
    return joinPaths(this.getPlatformPath(), 'intents');
  }

  getEntitiesFolderPath(): string {
    return joinPaths(this.getPlatformPath(), 'entities');
  }
}
