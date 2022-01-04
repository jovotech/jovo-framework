import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { Instagram } from './Instagram';
import { InstagramConfig, InstagramPlatform } from './InstagramPlatform';

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
export * from './InstagramResponse';
export * from './InstagramUser';
export * from './output';
