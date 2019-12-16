import { Config } from './VoiceHeroAlexa';

interface AppVoiceHeroConfig {
  VoiceHeroAlexa?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppAnalyticsConfig extends AppVoiceHeroConfig {}
  export interface ExtensiblePluginConfigs extends AppVoiceHeroConfig {}
}

export { VoiceHeroAlexa, Config } from './VoiceHeroAlexa';
