import { RasaNlu, RasaNluConfig } from './RasaNlu';

declare module '@jovotech/core/dist/Extensible' {
  interface ExtensiblePluginConfig {
    RasaNlu?: RasaNluConfig;
  }

  interface ExtensiblePlugins {
    RasaNlu?: RasaNlu;
  }
}

export * from './interfaces';
export * from './RasaNlu';
