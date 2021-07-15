import { registerPlatformSpecificJovoReference, isNode } from '@jovotech/framework';
import { AlexaPlatform, AlexaConfig } from './AlexaPlatform';
import { Alexa } from './Alexa';
import type { AlexaCli as AlexaCliType } from './cli';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    AlexaPlatform?: AlexaConfig;
  }

  interface ExtensiblePlugins {
    AlexaPlatform?: AlexaPlatform;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $alexa?: Alexa;
  }
}
registerPlatformSpecificJovoReference('$alexa', Alexa);

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const AlexaCli: typeof AlexaCliType = isNode() ? require('./cli').AlexaCli : null;
export * from './Alexa';
export * from './AlexaRequest';
export * from './AlexaUser';
export * from './AlexaPlatform';
export type { AlexaResponse } from '@jovotech/output-alexa';
export * from './constants';
export * from './interfaces';
