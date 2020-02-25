import { Config } from './LuisNlu';

interface AppLuisNluConfig {
  LuisNlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface AppNluConfig extends AppLuisNluConfig {}
  interface ExtensiblePluginConfigs extends AppLuisNluConfig {}
}
export * from './LuisNlu';
export * from './Interfaces';
