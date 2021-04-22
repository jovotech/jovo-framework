import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';

import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { NewHook } from './hooks/NewHook';
import { PluginConfigGoogle } from './utils/Interfaces';

export class GoogleAssistantCli extends JovoCliPlugin {
  $type: PluginType = 'platform';
  $id: string = 'googleAction';
  $config: PluginConfigGoogle = {
    projectId: '<YOUR-PROJECT-ID-HERE>',
  };

  constructor(config: PluginConfigGoogle = {}) {
    super(config);

    if (config) {
      this.$config = config;
    }
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook, NewHook];
  }
}
