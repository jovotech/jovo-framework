import { RasaNlu, RasaNluConfig } from './RasaNlu';

declare module '@jovotech/framework/dist/Extensible' {
  interface ExtensiblePluginConfig {
    RasaNlu?: RasaNluConfig;
  }

  interface ExtensiblePlugins {
    RasaNlu?: RasaNlu;
  }
}

export * from './interfaces';
export * from './RasaNlu';
