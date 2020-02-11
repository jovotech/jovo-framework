import { Config } from './AmazonLexSlu';

interface AppAmazonLexSluConfig {
  AmazonLexSlu?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppNluConfig extends AppAmazonLexSluConfig {}
  export interface ExtensiblePluginConfigs extends AppAmazonLexSluConfig {}
}

export * from './AmazonLexSlu';
export * from './Interfaces';
