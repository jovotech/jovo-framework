import { Config as AlexaConfig } from './OneDashAlexa';

interface AppOneDashConfig {
  OneDashAlexa?: AlexaConfig;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppAnalyticsConfig extends AppOneDashConfig {}

  export interface ExtensiblePluginConfigs extends AppOneDashConfig {}
}

export { OneDashAlexa, Config as AlexaConfig } from './OneDashAlexa';
