import { GenericCard, GenericMessage, GenericQuickReply } from '@jovotech/output';
import { Card } from './models';

export function augmentGenericPrototypes(): void {
  GenericCard.prototype.toDialogflowCard = function () {
    const card: Card = {};
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

  GenericMessage.prototype.toDialogflowText = function () {
    return { text: [this.displayText || this.text] };
  };

  GenericQuickReply.prototype.toDialogflowQuickReply = function () {
    return this.value || this.text;
  };
}
