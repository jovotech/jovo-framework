import { Config as AlexaConfig } from './ChatbaseAlexa';
import { Config as GoogleAssistantConfig } from './ChatbaseGoogleAssistant';

interface AppChatbaseConfig {
  ChatbaseAlexa?: AlexaConfig;
  ChatbaseGoogleAssistant?: GoogleAssistantConfig;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppAnalyticsConfig extends AppChatbaseConfig {}

  export interface ExtensiblePluginConfigs extends AppChatbaseConfig {}
}

export { ChatbaseAlexa, Config as AlexaConfig } from './ChatbaseAlexa';
export {
  ChatbaseGoogleAssistant,
  Config as GoogleAssistantConfig,
} from './ChatbaseGoogleAssistant';
