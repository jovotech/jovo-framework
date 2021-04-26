import { Alexa, AlexaConfig } from './Alexa';

declare module '@jovotech/core/dist/Extensible' {
  interface ExtensiblePluginConfig {
    Alexa?: AlexaConfig;
  }

  interface ExtensiblePlugins {
    Alexa?: Alexa;
  }
}

export * from './Alexa';
export * from './AlexaRequest';
export type { AlexaResponse } from '@jovotech/output-alexa';
export * from './AlexaSkill';
export * from './interfaces';
export * from './AlexaUser';
