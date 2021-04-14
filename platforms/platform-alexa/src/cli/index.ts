import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { PluginConfigAlexa } from './utils/Interfaces';
import SupportedLocales from './utils/SupportedLocales.json';

export class AlexaCli extends JovoCliPlugin {
  type: PluginType = 'platform';
  id: string = 'alexaSkill';
  supportedLocales: string[] = SupportedLocales;

  constructor(config: PluginConfigAlexa) {
    super(config);
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook];
  }
}
