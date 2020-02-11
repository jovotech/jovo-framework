import { Config } from './GCloudTts';

interface AppGCloudTtsConfig {
  GCloudTts?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface ExtensiblePluginConfigs extends AppGCloudTtsConfig {}
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

export * from './GCloudTts';
export * from './Interfaces';
