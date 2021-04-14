import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';

import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { PluginConfigGoogle } from './utils/Interfaces';
import SupportedLocales from './utils/SupportedLocales.json';

export class GoogleAssistantCli extends JovoCliPlugin {
  type: PluginType = 'platform';
  id: string = 'googleAction';
  supportedLocales: string[] = SupportedLocales;

  constructor(config: PluginConfigGoogle) {
    super(config);
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook];
  }
}
