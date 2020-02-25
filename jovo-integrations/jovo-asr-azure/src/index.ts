import { Config } from './AzureAsr';

interface AppAzureAsrConfig {
  AzureAsr?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface ExtensiblePluginConfigs extends AppAzureAsrConfig {}
}

export * from './AzureAsr';
export * from './Interfaces';
