import { registerPlatformSpecificJovoReference } from '@jovotech/framework';
import { FacebookMessenger, FacebookMessengerConfig } from './FacebookMessenger';
import { MessengerBot } from './MessengerBot';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    FacebookMessenger?: FacebookMessengerConfig;
  }

  interface ExtensiblePlugins {
    FacebookMessenger?: FacebookMessenger;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $messengerBot?: MessengerBot;
  }
}
registerPlatformSpecificJovoReference('$messengerBot', MessengerBot);

export * from './FacebookMessenger';
export * from './FacebookMessengerRequest';
export * from './FacebookMessengerUser';
export * from './MessengerBot';
export type { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';
export * from './interfaces';
export * from './constants';
