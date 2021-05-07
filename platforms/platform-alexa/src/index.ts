import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { Alexa, AlexaConfig } from './Alexa';
import { AlexaSkill } from './AlexaSkill';

declare module '@jovotech/framework/dist/Extensible' {
  interface ExtensiblePluginConfig {
    Alexa?: AlexaConfig;
  }

  interface ExtensiblePlugins {
    Alexa?: Alexa;
  }
}

declare module '@jovotech/framework/dist/Jovo' {
  interface Jovo {
    $alexaSkill?: AlexaSkill;
  }
}
registerPlatformSpecificJovoReference('$alexaSkill', AlexaSkill);

export * from './Alexa';
export * from './AlexaRequest';
export * from './AlexaUser';
export * from './AlexaSkill';
export type { AlexaResponse } from '@jovotech/output-alexa';
export * from './interfaces';
