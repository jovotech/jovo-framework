import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { CorePlatform, CorePlatformConfig } from './CorePlatform';
import { Core } from './Core';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    CorePlatform?: CorePlatformConfig;
  }

  interface ExtensiblePlugins {
    CorePlatform?: CorePlatform;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $corePlatform?: Core;
  }
}
registerPlatformSpecificJovoReference('$corePlatform', Core);

export * from './Core';
export * from './CorePlatform';
export * from './CorePlatformRequest';
export * from './CorePlatformUser';
export type { CorePlatformResponse } from '@jovotech/output-core';
export * from './interfaces';
