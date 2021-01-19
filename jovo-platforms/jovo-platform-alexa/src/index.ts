import { Alexa, AlexaConfig } from './Alexa';

declare module 'jovo-core/dist/Extensible' {
  interface ExtensiblePluginConfig {
    Alexa?: AlexaConfig;
  }

  interface ExtensiblePlugins {
    Alexa?: Alexa;
  }
}

export * from './Alexa';
export * from './AlexaRequest';
export type { AlexaResponse } from 'jovo-output-alexa';
export * from './AlexaSkill';
export * from './interfaces';
