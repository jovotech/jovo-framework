import {
  MessageValue,
  MultipleResponsesOutputTemplateConverterStrategy,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReply,
  QuickReplyValue,
  removeSSML,
} from '@jovotech/output';
import { MESSAGE_TEXT_MAX_LENGTH } from './constants';
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

export class FacebookMessengerOutputTemplateConverterStrategy extends MultipleResponsesOutputTemplateConverterStrategy<
  FacebookMessengerResponse,
  OutputTemplateConverterStrategyConfig
> {
  responseClass = FacebookMessengerResponse;
  platformName: 'FacebookMessenger';

  // maybe we need more context here, like index of template
  protected sanitizeOutput(output: OutputTemplate, index?: number): OutputTemplate {
    const pathPrefix = index ? `[${index}]` : '';
    if (output.message) {
      output.message = this.sanitizeMessage(output.message, `${pathPrefix}message`);
    }

    // TODO implement complete sanitization

    return output;
  }

  protected sanitizeMessage(
    message: MessageValue,
    path: string,
    maxLength = MESSAGE_TEXT_MAX_LENGTH,
    offset?: number,
  ): MessageValue {
    return super.sanitizeMessage(message, path, maxLength, offset);
  }

  convertOutput(output: OutputTemplate): FacebookMessengerResponse | FacebookMessengerResponse[] {
    const getResponseBase: () => FacebookMessengerResponse = () => ({
      messaging_type: MessagingType.Response,
      recipient: {
        id: '',
      },
    });
    let result: FacebookMessengerResponse | FacebookMessengerResponse[] = getResponseBase();

    const addResponseMessage = (message: FacebookMessengerMessage) => {
      if (!Array.isArray(result) && result.message) {
        result = [result];
      }
      if (Array.isArray(result)) {
        const newResult = getResponseBase();
        newResult.message = message;
        result.push(newResult);
      } else {
        result.message = message;
      }
    };

    const message = output.message;
    if (message) {
      const facebookMessage = this.convertMessageToFacebookMessengerMessage(message);
      const quickReplies = output.quickReplies;
      if (quickReplies) {
        facebookMessage.quick_replies = quickReplies.map(
          this.convertQuickReplyToFacebookMessengerQuickReply,
        );
      }

      addResponseMessage(facebookMessage);
    }

    const card = output.card;
    if (card?.toFacebookMessengerMessage) {
      addResponseMessage(card.toFacebookMessengerMessage());
    }

    const carousel = output.carousel;
    if (carousel?.toFacebookMessengerMessage) {
      addResponseMessage(carousel.toFacebookMessengerMessage());
    }

    if (output.platforms?.FacebookMessenger?.nativeResponse) {
      // TODO determine what to do with nativeResponse
    }

    return result;
  }

  convertResponse(response: FacebookMessengerResponse): OutputTemplate {
    const output: OutputTemplate = {};

    if (response.message?.text) {
      output.message = response.message.text;
    } else if (
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
      ? { text: removeSSML(message) }
      : message.toFacebookMessengerMessage?.() || {
          text: removeSSML(message.displayText || message.text),
          quick_replies: [],
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
