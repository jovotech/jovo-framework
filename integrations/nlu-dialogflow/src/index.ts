import { DialogflowNlu, DialogflowNluConfig } from './DialogflowNlu';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    DialogflowNlu?: DialogflowNluConfig;
  }

  interface ExtensiblePlugins {
    DialogflowNlu?: DialogflowNlu;
  }
}

export * from './interfaces';
export * from './constants';
export * from './DialogflowNlu';
