import { Config } from './PlatformStorage';
interface AppPlatformStorageConfig {
    PlatformStorage?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface AppDbConfig extends AppPlatformStorageConfig {
    }
    interface ExtensiblePluginConfigs extends AppPlatformStorageConfig {
    }
}
export { PlatformStorage, Config } from './PlatformStorage';
