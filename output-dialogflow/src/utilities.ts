import {
  Card,
  Message,
  MessageValue,
  QuickReply,
  removeSSML,
  SpeechMessage,
  TextMessage,
} from '@jovotech/output';
import { Card as DialogflowCard, Text } from './models';

export function convertMessageToDialogflowText(message: MessageValue): Text {
  return {
    text: [
      removeSSML(
        typeof message === 'string' ? message : message.text || (message.speech as string),
      ),
    ],
  };
}

export function augmentModelPrototypes(): void {
  Card.prototype.toDialogflowCard = function () {
    const card: DialogflowCard = {};
    if (this.title) {
      card.title = this.title;
    }
    if (this.subtitle) {
      card.subtitle = this.subtitle;
    }
    if (this.imageUrl) {
      card.image_uri = this.imageUrl;
    }
    return card;
  };

  Message.prototype.toDialogflowText = function () {
    return convertMessageToDialogflowText(this as TextMessage | SpeechMessage);
  };

  QuickReply.prototype.toDialogflowQuickReply = function () {
    return this.value || this.text;
  };
}
