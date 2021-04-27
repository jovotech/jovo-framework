import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';

import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { NewHook } from './hooks/NewHook';
import { PluginConfigGoogle } from './utils/Interfaces';

export class GoogleAssistantCli extends JovoCliPlugin {
  $type: PluginType = 'platform';
  $id: string = 'googleAction';

  constructor(config?: PluginConfigGoogle) {
    super(config);
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook, NewHook];
  }

  getDefaultConfig(): PluginConfigGoogle {
    return {
      projectId: '<YOUR-PROJECT-ID-HERE>',
    };
  }
}
