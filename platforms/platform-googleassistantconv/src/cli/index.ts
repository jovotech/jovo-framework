import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { BuildHook, DeployHook, GetHook } from './hooks';
import { PluginConfigGoogle } from './utils/Interfaces';

export class GoogleAssistantCli extends JovoCliPlugin {
  type: PluginType = 'platform';
  id: string = 'googleAction';

  constructor(config: PluginConfigGoogle) {
    super(config);
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook];
  }
}
