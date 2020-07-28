import { Config } from './NlpjsNlu';

interface AppNlpjsNluConfig {
  NlpjsNlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface AppNluConfig extends AppNlpjsNluConfig {}
  interface ExtensiblePluginConfigs extends AppNlpjsNluConfig {}
}
export * from './NlpjsNlu';
export * from './Interfaces';
