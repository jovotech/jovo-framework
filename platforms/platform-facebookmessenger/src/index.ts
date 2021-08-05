import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { FacebookMessengerPlatform, FacebookMessengerConfig } from './FacebookMessengerPlatform';
import { FacebookMessenger } from './FacebookMessenger';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    FacebookMessengerPlatform?: FacebookMessengerConfig;
  }

  interface ExtensiblePlugins {
    FacebookMessengerPlatform?: FacebookMessengerPlatform;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $facebookMessenger?: FacebookMessenger;
  }
}
registerPlatformSpecificJovoReference('$facebookMessenger', FacebookMessenger);

export * from './FacebookMessenger';
export * from './FacebookMessengerPlatform';
export * from './FacebookMessengerRequest';
export * from './FacebookMessengerUser';
export type { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';
export * from './interfaces';
export * from './constants';
