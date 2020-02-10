import { Config } from '../../jovo-tts-azure/src';

interface AppAzureTtsConfig {
  AzureTts?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface ExtensiblePluginConfigs extends AppAzureTtsConfig {}
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface TellOutput {
    speechText?: string;
  }

  interface AskOutput {
    speechText?: string;
    repromptText?: string;
  }
}

export { AmazonPollyTts } from './AmazonPollyTts';
export * from './Interfaces';
