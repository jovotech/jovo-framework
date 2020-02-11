import { Config } from './WitAiSlu';

interface AppWitAiSluConfig {
  WitAiSlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppNluConfig extends AppWitAiSluConfig {}
  export interface ExtensiblePluginConfigs extends AppWitAiSluConfig {}
}

export * from './WitAiSlu';
export * from './Interfaces';
