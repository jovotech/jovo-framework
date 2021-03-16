import { GenericCard, GenericCarousel, GenericMessage, GenericQuickReply } from '@jovotech/output';
import { GenericTemplateElement, Message, QuickReplyContentType, TemplateType } from './models';

export function augmentGenericPrototypes(): void {
  GenericCard.prototype.toFacebookMessengerGenericTemplateElement = function () {
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

  GenericCard.prototype.toFacebookMessengerGenericTemplate = function () {
    return {
      template_type: TemplateType.Generic,
      elements: [this.toFacebookMessengerGenericTemplateElement!()],
    };
  };

  GenericCarousel.prototype.toFacebookMessengerGenericTemplate = function () {
    return {
      template_type: TemplateType.Generic,
      elements: this.items.map((item) => item.toFacebookMessengerGenericTemplateElement!()),
    };
  };

  GenericMessage.prototype.toFacebookMessengerMessage = function () {
    const message: Message = {
      text: this.displayText || this.text,
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

  GenericQuickReply.prototype.toFacebookQuickReply = function () {
    return {
      content_type: QuickReplyContentType.Text,
      title: this.text,
      payload: this.value || this.text,
    };
  };
}
