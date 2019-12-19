import { Config as AlexaConfig } from './BespokenAlexa';
import { Config as GoogleAssistantConfig } from './BespokenGoogleAssistant';

interface AppBespokenConfig {
  BespokenAlexa?: AlexaConfig;
  BespokenGoogleAssistant?: GoogleAssistantConfig;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppAnalyticsConfig extends AppBespokenConfig {}

  export interface ExtensiblePluginConfigs extends AppBespokenConfig {}
}

export { BespokenAlexa, Config as AlexaConfig } from './BespokenAlexa';
export {
  BespokenGoogleAssistant,
  Config as GoogleAssistantConfig,
} from './BespokenGoogleAssistant';
export * from './Interfaces';
