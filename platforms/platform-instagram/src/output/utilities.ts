import { Card, Carousel, Message, QuickReply } from '@jovotech/output';

export function augmentModelPrototypes(): void {
  Card.prototype.toInstagramGenericTemplateElement =
    Card.prototype.toFacebookMessengerGenericTemplateElement;

  Card.prototype.toInstagramGenericTemplate = Card.prototype.toFacebookMessengerGenericTemplate;

  Card.prototype.toInstagramMessage = Card.prototype.toFacebookMessengerMessage;

  Carousel.prototype.toInstagramGenericTemplate =
    Carousel.prototype.toFacebookMessengerGenericTemplate;

  Carousel.prototype.toInstagramMessage = Carousel.prototype.toFacebookMessengerMessage;

  Message.prototype.toInstagramMessage = Message.prototype.toFacebookMessengerMessage;

  QuickReply.prototype.toInstagramQuickReply = QuickReply.prototype.toFacebookQuickReply;
}
