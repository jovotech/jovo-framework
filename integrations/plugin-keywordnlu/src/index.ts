import { KeywordNluPlugin, KeywordNluPluginConfig } from './KeywordNluPlugin';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    KeywordNluPlugin?: KeywordNluPluginConfig;
  }

  interface ExtensiblePlugins {
    KeywordNluPlugin?: KeywordNluPlugin;
  }
}

export * from './KeywordNluPlugin';
