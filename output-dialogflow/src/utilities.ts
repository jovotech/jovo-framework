import { Card, Message, QuickReply } from '@jovotech/output';
import { Card as DialogflowCard } from './models';

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
    return { text: [this.displayText || this.text] };
  };

  QuickReply.prototype.toDialogflowQuickReply = function () {
    return this.value || this.text;
  };
}
