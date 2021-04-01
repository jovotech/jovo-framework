import { JovoCliPlugin, JovoCliPluginType } from '@jovotech/cli-core';
import { BuildHook, GetHook, DeployHook } from './hooks';
import { JovoCliPluginConfigAlexa } from './utils/Interfaces';

export class AlexaCli extends JovoCliPlugin {
  type: JovoCliPluginType = 'platform';
  id: string = 'alexaSkill';

  constructor(config: JovoCliPluginConfigAlexa) {
    super(config);
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook];
  }
}
