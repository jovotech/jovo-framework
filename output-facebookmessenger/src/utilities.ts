import { Card, Carousel, Message, QuickReply, removeSSML } from '@jovotech/output';
import { GENERIC_TEMPLATE_MAX_SIZE } from './constants';
import {
  GenericTemplateElement,
  Message as FacebookMessengerMessage,
  QuickReplyContentType,
  TemplateType,
} from './models';

export function augmentModelPrototypes(): void {
  Card.prototype.toFacebookMessengerGenericTemplateElement = function () {
    const element: GenericTemplateElement = {
      title: this.title,
    };
    if (this.subtitle) {
      element.subtitle = this.subtitle;
    }
    if (this.imageUrl) {
      element.image_url = this.imageUrl;
    }
    return element;
  };

  Card.prototype.toFacebookMessengerGenericTemplate = function () {
    return {
      template_type: TemplateType.Generic,
      elements: [this.toFacebookMessengerGenericTemplateElement!()],
    };
  };

  Carousel.prototype.toFacebookMessengerGenericTemplate = function () {
    return {
      template_type: TemplateType.Generic,
      elements: this.items
        .slice(0, GENERIC_TEMPLATE_MAX_SIZE)
        .map((item) => item.toFacebookMessengerGenericTemplateElement!()),
    };
  };

  Message.prototype.toFacebookMessengerMessage = function () {
    const message: FacebookMessengerMessage = {
      text: removeSSML(this.displayText || this.text),
    };
    return message;
  };

  QuickReply.prototype.toFacebookQuickReply = function () {
    return {
      content_type: QuickReplyContentType.Text,
      title: this.text,
      payload: this.value || this.text,
    };
  };
}
