import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';

import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { PluginConfigGoogle } from './utils/Interfaces';

export class GoogleAssistantCli extends JovoCliPlugin {
  type: PluginType = 'platform';
  id = 'googleAction';

  constructor(config: PluginConfigGoogle) {
    super(config);
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook];
  }
}
