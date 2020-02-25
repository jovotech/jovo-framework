import { Config } from './AzureTts';

interface AppAzureTtsConfig {
  AzureTts?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface ExtensiblePluginConfigs extends AppAzureTtsConfig {}
}

export * from './AzureTts';
