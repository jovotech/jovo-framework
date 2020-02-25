import { Config } from './WitAiSlu';

interface AppWitAiSluConfig {
  WitAiSlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface AppNluConfig extends AppWitAiSluConfig {}
  interface ExtensiblePluginConfigs extends AppWitAiSluConfig {}
}

export * from './WitAiSlu';
export * from './Interfaces';
