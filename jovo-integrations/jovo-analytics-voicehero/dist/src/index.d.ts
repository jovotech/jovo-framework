import { Config } from './VoiceHeroAlexa';
interface AppVoiceHeroConfig {
    VoiceHeroAlexa?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppAnalyticsConfig extends AppVoiceHeroConfig {
    }
    interface ExtensiblePluginConfigs extends AppVoiceHeroConfig {
    }
}
export { VoiceHeroAlexa, Config } from './VoiceHeroAlexa';
