import { MicrosoftCluNlu, MicrosoftCluNluConfig } from './MicrosoftCluNlu';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    MicrosoftCluNlu?: MicrosoftCluNluConfig;
  }

  interface ExtensiblePlugins {
    MicrosoftCluNlu?: MicrosoftCluNlu;
  }
}

export * from './constants';
export * from './MicrosoftCluNlu';
