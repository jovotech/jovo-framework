import { Card, Carousel, Message, QuickReply, removeSSML } from '@jovotech/output';
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
      elements: this.items.map((item) => item.toFacebookMessengerGenericTemplateElement!()),
    };
  };

  Message.prototype.toFacebookMessengerMessage = function () {
    const message: FacebookMessengerMessage = {
      text: removeSSML(this.displayText || this.text),
    };
    if (this.quickReplies) {
      message.quick_replies = this.quickReplies.map((quickReply) => {
        return typeof quickReply === 'string'
          ? {
              content_type: QuickReplyContentType.Text,
              title: quickReply,
              payload: quickReply,
            }
          : quickReply.toFacebookQuickReply?.() || {
              content_type: QuickReplyContentType.Text,
              title: quickReply.text,
              payload: quickReply.value || quickReply.text,
            };
      });
    }
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
