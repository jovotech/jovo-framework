import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { BuildHook, GetHook, DeployHook } from './hooks';
import { PluginConfigAlexa } from './utils/Interfaces';

export class AlexaCli extends JovoCliPlugin {
  type: PluginType = 'platform';
  id: string = 'alexaSkill';
  supportedLocales: string[] = [
    'en-AU',
    'en-CA',
    'en-IN',
    'en-GB',
    'en-US',
    'fr-CA',
    'fr-FR',
    'de-DE',
    'hi-IN',
    'it-IT',
    'ja-JP',
    'pt-BR',
    'es-ES',
    'es-MX',
    'es-US',
  ];

  constructor(config: PluginConfigAlexa) {
    super(config);
  }

  getHooks() {
    return [BuildHook, GetHook, DeployHook];
  }
}
