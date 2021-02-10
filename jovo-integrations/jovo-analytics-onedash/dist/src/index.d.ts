import { Config as AlexaConfig } from './OneDashAlexa';
interface AppOneDashConfig {
    OneDashAlexa?: AlexaConfig;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppAnalyticsConfig extends AppOneDashConfig {
    }
    interface ExtensiblePluginConfigs extends AppOneDashConfig {
    }
}
export { OneDashAlexa, Config as AlexaConfig } from './OneDashAlexa';
