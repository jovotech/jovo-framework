import {
  MessageValue,
  OutputTemplate,
  OutputTemplateConverterStrategy,
  QuickReply,
  QuickReplyValue,
} from '@jovotech/output';
import _merge from 'lodash.merge';
import {
  FacebookMessengerResponse,
  GenericTemplate,
  Message as FacebookMessengerMessage,
  MessageAttachmentType,
  MessagingType,
  QuickReply as FacebookMessengerQuickReply,
  QuickReplyContentType,
  TemplateType,
} from './models';

export class FacebookMessengerOutputTemplateConverterStrategy
  implements OutputTemplateConverterStrategy<FacebookMessengerResponse> {
  responseClass = FacebookMessengerResponse;

  toResponse(output: OutputTemplate): FacebookMessengerResponse {
    const response: FacebookMessengerResponse = {
      messaging_type: MessagingType.Response,
      recipient: {
        id: '',
      },
    };

    const message = output.platforms?.FacebookMessenger?.message || output.message;
    if (message) {
      response.message = this.convertMessageToFacebookMessengerMessage(message);
    }

    const card = output.platforms?.FacebookMessenger?.card || output.card;
    if (card) {
      response.message = {
        attachment: {
          type: MessageAttachmentType.Template,
          payload: card.toFacebookMessengerGenericTemplate!(),
        },
      };
    }

    const carousel = output.platforms?.FacebookMessenger?.carousel || output.carousel;
    if (carousel) {
      response.message = {
        attachment: {
          type: MessageAttachmentType.Template,
          payload: carousel.toFacebookMessengerGenericTemplate!(),
        },
      };
    }

    if (output.platforms?.FacebookMessenger?.nativeResponse) {
      _merge(response, output.platforms.FacebookMessenger.nativeResponse);
    }

    return response;
  }

  fromResponse(response: FacebookMessengerResponse): OutputTemplate {
    const output: OutputTemplate = {};

    if (response.message?.text) {
      output.message = response.message.text;
    }

    if (
      response.message?.attachment?.type === MessageAttachmentType.Template &&
      response.message?.attachment?.payload?.template_type === TemplateType.Generic
    ) {
      const genericTemplate = response.message?.attachment?.payload as Partial<GenericTemplate>;

      if (genericTemplate.elements?.length === 1 && genericTemplate.elements[0].toCard) {
        output.card = genericTemplate.elements[0].toCard();
      } else if ((genericTemplate.elements?.length || 0) > 1 && genericTemplate.toCarousel) {
        output.carousel = genericTemplate.toCarousel();
      }
    }

    if (response.message?.quick_replies?.length) {
      output.quickReplies = response.message.quick_replies
        .filter((quickReply) => quickReply.content_type === QuickReplyContentType.Text)
        .map((quickReply) => quickReply.toQuickReply!() as QuickReply);
    }

    return output;
  }

  convertMessageToFacebookMessengerMessage(message: MessageValue): FacebookMessengerMessage {
    return typeof message === 'string'
      ? { text: message }
      : message.toFacebookMessengerMessage?.() || {
          text: message.displayText || message.text,
          quick_replies: message.quickReplies?.map((quickReply) =>
            this.convertQuickReplyToFacebookMessengerQuickReply(quickReply),
          ),
        };
  }

  convertQuickReplyToFacebookMessengerQuickReply(
    quickReply: QuickReplyValue,
  ): FacebookMessengerQuickReply {
    return typeof quickReply === 'string'
      ? { content_type: QuickReplyContentType.Text, title: quickReply, payload: quickReply }
      : quickReply.toFacebookQuickReply?.() || {
          content_type: QuickReplyContentType.Text,
          title: quickReply.text,
          payload: quickReply.value || quickReply.text,
        };
  }
}
