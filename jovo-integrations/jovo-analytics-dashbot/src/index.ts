import { Config as AlexaConfig } from './DashbotAlexa';
import { Config as GoogleAssistantConfig } from './DashbotGoogleAssistant';

interface AppDashbotConfig {
  DashbotAlexa?: AlexaConfig;
  DashbotGoogleAssistant?: GoogleAssistantConfig;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppAnalyticsConfig extends AppDashbotConfig {}
  export interface ExtensiblePluginConfigs extends AppDashbotConfig {}
}

export { DashbotAlexa, Config as AlexaConfig } from './DashbotAlexa';
export { DashbotGoogleAssistant, Config as GoogleAssistantConfig } from './DashbotGoogleAssistant';
