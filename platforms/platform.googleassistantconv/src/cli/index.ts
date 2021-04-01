import { JovoCliPlugin, JovoCliPluginType } from '@jovotech/cli-core';
import { BuildHook, DeployHook, GetHook } from './hooks';

export class GoogleAssistantCli extends JovoCliPlugin {
  type: JovoCliPluginType = 'platform';
  id: string = 'googleAction';

  getHooks() {
    return [BuildHook, GetHook, DeployHook];
  }
}
