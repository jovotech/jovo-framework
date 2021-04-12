import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { BuildHook, DeployHook, GetHook } from './hooks';
import { PluginConfigGoogle } from './utils/Interfaces';
import SUPPORTED_LOCALES from './utils/SupportedLocales.json';

export class GoogleAssistantCli extends JovoCliPlugin {
  type: PluginType = 'platform';
  id: string = 'googleAction';
  supportedLocales: string[] = SUPPORTED_LOCALES;

  constructor(config: PluginConfigGoogle) {
    super(config);
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook];
  }
}
