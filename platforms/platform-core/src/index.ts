import { CorePlatform, CorePlatformConfig } from './CorePlatform';

declare module '@jovotech/core/dist/Extensible' {
  interface ExtensiblePluginConfig {
    CorePlatform?: CorePlatformConfig;
  }

  interface ExtensiblePlugins {
    CorePlatform?: CorePlatform;
  }
}


export * from './CorePlatform';
export * from './CorePlatformApp';
export * from './CorePlatformRequest';
export type { CorePlatformResponse } from '@jovotech/output-core';
export * from './interfaces';
