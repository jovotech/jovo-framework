import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { GoogleBusiness, GoogleBusinessConfig } from './GoogleBusiness';
import { GoogleBusinessBot } from './GoogleBusinessBot';

declare module '@jovotech/framework/dist/Extensible' {
  interface ExtensiblePluginConfig {
    GoogleBusiness?: GoogleBusinessConfig;
  }

  interface ExtensiblePlugins {
    GoogleBusiness?: GoogleBusiness;
  }
}

declare module '@jovotech/framework/dist/Jovo' {
  interface Jovo {
    $googleBusinessBot?: GoogleBusinessBot;
  }
}
registerPlatformSpecificJovoReference('$googleBusinessBot', GoogleBusinessBot);

export * from './GoogleBusiness';
export * from './GoogleBusinessRequest';
export * from './GoogleBusinessUser';
export * from './GoogleBusinessBot';
export * from './GoogleBusinessApi';
export type { GoogleBusinessResponse } from '@jovotech/output-googlebusiness';
export * from './interfaces';
export * from './constants';
