import { NlpjsNlu, NlpjsNluConfig } from './NlpjsNlu';

declare module '@jovotech/core/dist/Extensible' {
  interface ExtensiblePluginConfig {
    NlpjsNlu?: NlpjsNluConfig;
  }

  interface ExtensiblePlugins {
    NlpjsNlu?: NlpjsNlu;
  }
}

export * from './NlpjsNlu';
