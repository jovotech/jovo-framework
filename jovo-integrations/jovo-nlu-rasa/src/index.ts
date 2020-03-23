import { Config } from './RasaNlu';

interface AppRasaNluConfig {
  RasaNlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface AppNluConfig extends AppRasaNluConfig {}
  interface ExtensiblePluginConfigs extends AppRasaNluConfig {}
}
export * from './RasaNlu';
export * from './Interfaces';
