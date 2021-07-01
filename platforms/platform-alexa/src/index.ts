import { registerPlatformSpecificJovoReference, isNode } from '@jovotech/framework';
import { Alexa, AlexaConfig } from './Alexa';
import { AlexaSkill } from './AlexaSkill';
import type { AlexaCli as AlexaCliType } from './cli';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    Alexa?: AlexaConfig;
  }

  interface ExtensiblePlugins {
    Alexa?: Alexa;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $alexaSkill?: AlexaSkill;
  }
}
registerPlatformSpecificJovoReference('$alexaSkill', AlexaSkill);

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const AlexaCli: typeof AlexaCliType = isNode() ? require('./cli').AlexaCli : null;
export * from './Alexa';
export * from './AlexaRequest';
export * from './AlexaUser';
export * from './AlexaSkill';
export type { AlexaResponse } from '@jovotech/output-alexa';
export * from './constants';
export * from './interfaces';
