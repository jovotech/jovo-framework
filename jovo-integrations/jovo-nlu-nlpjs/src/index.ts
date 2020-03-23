import { Config } from './NlpjsNlu';

interface AppLuisNluConfig {
  LuisNlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface AppNluConfig extends AppLuisNluConfig {}
  interface ExtensiblePluginConfigs extends AppLuisNluConfig {}
}
export * from './NlpjsNlu';
export * from './Interfaces';
