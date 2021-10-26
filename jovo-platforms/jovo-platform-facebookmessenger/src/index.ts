import { MessengerBot } from './core/MessengerBot';
import { Config } from './FacebookMessenger';
import { ApiVersion, QuickReply } from './Interfaces';
import { Message } from './responses/Message';

export { FacebookMessenger, Config, PersistentMenuElement } from './FacebookMessenger';

export const BASE_URL = 'https://graph.facebook.com';
export const DEFAULT_VERSION: ApiVersion = 'v8.0';

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $messengerBot?: MessengerBot;

    messengerBot(): MessengerBot;

    isMessengerBot(): boolean;
  }
}

interface AppFacebookMessengerConfig {
  FacebookMessenger?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface Output {
    FacebookMessenger: {
      Message?: Message;
      Overwrite?: {
        Text?: string;
        QuickReplies?: QuickReply[];
      };
    };
  }

  export interface AppPlatformConfig extends AppFacebookMessengerConfig {}

  export interface ExtensiblePluginConfigs extends AppFacebookMessengerConfig {}
}

export * from './Interfaces';
export * from './Enums';
export * from './core/MessengerBot';
export * from './core/MessengerBotRequest';
export * from './core/MessengerBotResponse';
export * from './core/MessengerBotSpeechBuilder';
export * from './core/MessengerBotUser';
export * from './core/FacebookMessengerRequestBuilder';
export * from './core/FacebookMessengerResponseBuilder';

export * from './modules/FacebookMessengerCore';

export * from './responses/Button';
export * from './responses/Message';
export * from './responses/SenderAction';
export * from './responses/Template';

export * from './responses/buttons/CallButton';
export * from './responses/buttons/LinkButton';
export * from './responses/buttons/LoginButton';
export * from './responses/buttons/PostbackButton';

export * from './responses/messages/AttachmentMessage';
export * from './responses/messages/TextMessage';

export * from './responses/quick-replies/BuiltInQuickReply';
export * from './responses/quick-replies/TextQuickReply';

export * from './responses/templates/AirlineTemplate';
export * from './responses/templates/ButtonTemplate';
export * from './responses/templates/GenericTemplate';
export * from './responses/templates/MediaTemplate';
export * from './responses/templates/ReceiptTemplate';
