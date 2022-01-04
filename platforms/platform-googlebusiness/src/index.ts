import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { GoogleBusiness } from './GoogleBusiness';
import { GoogleBusinessConfig, GoogleBusinessPlatform } from './GoogleBusinessPlatform';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    GoogleBusinessPlatform?: GoogleBusinessConfig;
  }

  interface ExtensiblePlugins {
    GoogleBusinessPlatform?: GoogleBusinessPlatform;
  }
}

declare module '@jovotech/framework/dist/types/interfaces' {
  interface SessionData {
    _GOOGLE_BUSINESS_PROCESSED_MESSAGES_?: string[];
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $googleBusiness?: GoogleBusiness;
  }
}
registerPlatformSpecificJovoReference('$googleBusiness', GoogleBusiness);

export * from './GoogleBusiness';
export * from './GoogleBusinessPlatform';
export * from './GoogleBusinessRequest';
export * from './GoogleBusinessResponse';
export * from './GoogleBusinessUser';
export * from './interfaces';
export * from './constants';
export * from './output';
