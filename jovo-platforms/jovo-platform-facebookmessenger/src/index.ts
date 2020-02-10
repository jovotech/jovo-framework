import { MessengerBot } from './core/MessengerBot';
import { SenderActionType } from './Enums';
import { Config } from './FacebookMessenger';
import { Message } from './responses/Message';
import { AttachmentMessageOptions } from './responses/messages/AttachmentMessage';
import { TextMessageOptions } from './responses/messages/TextMessage';
import { AirlineTemplateOptions } from './responses/templates/AirlineTemplate';
import { ButtonTemplateOptions } from './responses/templates/ButtonTemplate';
import { GenericTemplateOptions } from './responses/templates/GenericTemplate';
import { MediaTemplateOptions } from './responses/templates/MediaTemplate';
import { ReceiptTemplateOptions } from './responses/templates/ReceiptTemplate';
import { QuickReply } from './Interfaces';

export { FacebookMessenger, Config } from './FacebookMessenger';

export const BASE_URL = 'https://graph.facebook.com';
export const BASE_PATH = '/v5.0/me';

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
      Messages: Message[];
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
