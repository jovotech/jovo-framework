import { Config } from './DialogflowNlu';

export * from './DialogflowNlu';
export * from './Interfaces';

interface AppDialogflowNluConfig {
  DialogflowNlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface AppNluConfig extends AppDialogflowNluConfig {}
  interface ExtensiblePluginConfigs extends AppDialogflowNluConfig {}
}
