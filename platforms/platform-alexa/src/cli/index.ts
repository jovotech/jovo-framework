import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { BuildHook } from './hooks/BuildHook';
import { DeployHook } from './hooks/DeployHook';
import { GetHook } from './hooks/GetHook';
import { NewHook } from './hooks/NewHook';
import { PluginConfigAlexa } from './utils/Interfaces';

export class AlexaCli extends JovoCliPlugin {
  $id: string = 'alexaSkill';
  $type: PluginType = 'platform';

  constructor(config: PluginConfigAlexa) {
    super(config);
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook, NewHook];
  }
}
