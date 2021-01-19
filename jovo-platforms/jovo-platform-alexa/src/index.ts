import { AlexaConfig } from './Alexa';

declare module 'jovo-core/dist/Extensible' {
  interface ExtensiblePluginConfig {
    Alexa?: AlexaConfig;
  }
}

export * from './Alexa';
export * from './AlexaRequest';
export type { AlexaResponse } from 'jovo-output-alexa';
export * from './AlexaSkill';
