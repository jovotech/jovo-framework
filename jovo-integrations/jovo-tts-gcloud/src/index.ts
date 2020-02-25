import { Config } from './GCloudTts';

interface AppGCloudTtsConfig {
  GCloudTts?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface ExtensiblePluginConfigs extends AppGCloudTtsConfig {}
}

export * from './GCloudTts';
export * from './Interfaces';
