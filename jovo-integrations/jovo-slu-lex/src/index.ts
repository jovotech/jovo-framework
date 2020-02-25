import { Config } from './LexSlu';

interface AppLexSluConfig {
  LexSlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface AppNluConfig extends AppLexSluConfig {}
  interface ExtensiblePluginConfigs extends AppLexSluConfig {}
}

export * from './LexSlu';
export * from './Interfaces';
