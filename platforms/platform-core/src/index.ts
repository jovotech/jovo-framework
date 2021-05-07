import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { CorePlatform, CorePlatformConfig } from './CorePlatform';
import { CorePlatformApp } from './CorePlatformApp';

declare module '@jovotech/framework/dist/Extensible' {
  interface ExtensiblePluginConfig {
    CorePlatform?: CorePlatformConfig;
  }

  interface ExtensiblePlugins {
    CorePlatform?: CorePlatform;
  }
}

declare module '@jovotech/framework/dist/Jovo' {
  interface Jovo {
    $corePlatformApp?: CorePlatformApp;
  }
}
registerPlatformSpecificJovoReference('$corePlatformApp', CorePlatformApp);

export * from './CorePlatform';
export * from './CorePlatformRequest';
export * from './CorePlatformUser';
export * from './CorePlatformApp';
export type { CorePlatformResponse } from '@jovotech/output-core';
export * from './interfaces';
