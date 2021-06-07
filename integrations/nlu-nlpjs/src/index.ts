import { NlpjsNlu, NlpjsNluConfig } from './NlpjsNlu';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    NlpjsNlu?: NlpjsNluConfig;
  }

  interface ExtensiblePlugins {
    NlpjsNlu?: NlpjsNlu;
  }
}

export * from './NlpjsNlu';
