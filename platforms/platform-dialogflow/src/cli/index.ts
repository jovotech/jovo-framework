import { JovoCliPlugin, PluginHook, PluginType } from '@jovotech/cli-core';
import { join as joinPaths } from 'path';

import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { DialogflowConfig } from './utilities';

export class DialogflowCli extends JovoCliPlugin {
  readonly id: string = 'dialogflow';
  readonly type: PluginType = 'platform';
  readonly config!: DialogflowConfig;
  readonly platformDirectory: string = 'platform.dialogflow';

  constructor(config?: DialogflowConfig) {
    super(config);
  }

  getHooks(): typeof PluginHook[] {
    return [BuildHook, DeployHook, GetHook];
  }

  get name(): string {
    return this.constructor.name;
  }

  get platformPath(): string {
    return joinPaths(this.$cli.project!.getBuildPath(), this.platformDirectory);
  }

  get agentJsonPath(): string {
    return joinPaths(this.platformPath, 'agent.json');
  }

  get packageJsonPath(): string {
    return joinPaths(this.platformPath, 'package.json');
  }

  get intentsFolderPath(): string {
    return joinPaths(this.platformPath, 'intents');
  }

  get entitiesFolderPath(): string {
    return joinPaths(this.platformPath, 'entities');
  }
}
