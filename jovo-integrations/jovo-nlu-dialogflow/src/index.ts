import { Config } from './DialogflowNlu';

export * from './DialogflowNlu';
export * from './Interfaces';

interface AppDialogflowNluConfig {
  DialogflowNlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppNluConfig extends AppDialogflowNluConfig {}
  export interface ExtensiblePluginConfigs extends AppDialogflowNluConfig {}
}
