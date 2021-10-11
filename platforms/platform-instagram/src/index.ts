import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import {
  FacebookMessengerConfig as InstagramConfig,
  FacebookMessengerUser as InstagramUser,
} from '@jovotech/platform-facebookmessenger';
import { Instagram } from './Instagram';
import { InstagramPlatform } from './InstagramPlatform';
import { InstagramResponse } from '@jovotech/output-instagram';

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
export { InstagramResponse, InstagramUser };
