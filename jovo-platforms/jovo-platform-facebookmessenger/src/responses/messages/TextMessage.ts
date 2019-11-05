import { IdentityData, Message, MessageType, QuickReply } from '../..';

export interface TextMessageOptions {
  text: string;
  messageType?: MessageType;
  quickReplies?: QuickReply[];
}

export class TextMessage extends Message {
  message_type: MessageType;
  message: {
    text: string;
    quick_replies?: QuickReply[];
  };

  constructor(readonly recipient: IdentityData, options: TextMessageOptions) {
    super(recipient);

    this.message = {
      quick_replies: options.quickReplies,
      text: options.text,
    };
    this.message_type = options.messageType || MessageType.Response;
  }
}
