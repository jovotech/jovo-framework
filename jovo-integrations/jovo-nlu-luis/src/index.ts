import { Config } from './LuisNlu';

interface AppLuisNluConfig {
  LuisNlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppNluConfig extends AppLuisNluConfig {}
  export interface ExtensiblePluginConfigs extends AppLuisNluConfig {}
}
export * from './LuisNlu';
export * from './Interfaces';
