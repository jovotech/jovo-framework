import { SnipsNluConfig } from './interfaces';
import { SnipsNlu } from './SnipsNlu';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    SnipsNlu?: SnipsNluConfig;
  }

  interface ExtensiblePlugins {
    SnipsNlu?: SnipsNlu;
  }
}

export * from './interfaces';
export * from './SnipsNlu';
