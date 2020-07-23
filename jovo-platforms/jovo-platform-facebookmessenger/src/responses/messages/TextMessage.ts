import {
  IdentityData,
  Message,
  MessageType,
  MessengerBotSpeechBuilder,
  QuickReply,
  TextQuickReply,
} from '../..';

export interface TextMessageOptions {
  text: string;
  messageType?: MessageType;
  quickReplies?: Array<QuickReply | string>;
}

export class TextMessage extends Message {
  message_type: MessageType;
  message: {
    text: string;
    quick_replies?: QuickReply[];
  };

  constructor(readonly recipient: IdentityData, options: TextMessageOptions) {
    super(recipient);

    const quickReplies = options.quickReplies
      ? options.quickReplies.map((quickReply) => {
          return typeof quickReply === 'string' ? new TextQuickReply(quickReply) : quickReply;
        })
      : undefined;

    this.message = {
      quick_replies: quickReplies?.length ? quickReplies : undefined,
      text: MessengerBotSpeechBuilder.removeSSML(options.text),
    };
    this.message_type = options.messageType || MessageType.Response;
  }
}
