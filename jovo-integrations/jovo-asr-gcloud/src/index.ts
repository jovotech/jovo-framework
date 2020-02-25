import { Config } from './GCloudAsr';

interface AppGCloudAsrConfig {
  GCloudAsr?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface ExtensiblePluginConfigs extends AppGCloudAsrConfig {}
}

export * from './GCloudAsr';
export * from './Interfaces';
