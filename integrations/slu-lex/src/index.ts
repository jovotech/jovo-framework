import { LexSlu, LexSluConfig } from './LexSlu';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    LexSlu?: LexSluConfig;
  }

  interface ExtensiblePlugins {
    LexSlu?: LexSlu;
  }
}

export * from './LexSlu';
