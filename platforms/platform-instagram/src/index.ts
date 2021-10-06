import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { FacebookMessengerConfig } from '@jovotech/platform-facebookmessenger';
import { Instagram } from './Instagram';
import { InstagramPlatform } from './InstagramPlatform';
import { InstagramResponse } from '@jovotech/output-instagram';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    InstagramPlatform?: FacebookMessengerConfig;
  }

  interface ExtensiblePlugins {
    InstagramPlatform?: InstagramPlatform;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $instagram?: Instagram;
  }
}
registerPlatformSpecificJovoReference('$instagram', Instagram);

export * from './Instagram';
export * from './InstagramPlatform';
export { InstagramResponse };
