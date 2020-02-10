import { Config } from './PlatformStorage';

interface AppPlatformStorageConfig {
  PlatformStorage?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppDbConfig extends AppPlatformStorageConfig {}
  export interface ExtensiblePluginConfigs extends AppPlatformStorageConfig {}
}

export { PlatformStorage, Config } from './PlatformStorage';
