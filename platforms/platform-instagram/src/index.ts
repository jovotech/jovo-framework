import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { FacebookMessengerConfig as InstagramConfig } from '@jovotech/platform-facebookmessenger';
import { Instagram } from './Instagram';
import { InstagramPlatform } from './InstagramPlatform';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    InstagramPlatform?: InstagramConfig;
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
export * from './InstagramRequest';
export * from './InstagramUser';
export type { InstagramResponse } from '@jovotech/output-instagram';
