import {
  Carousel,
  MessageValue,
  MultipleResponsesOutputTemplateConverterStrategy,
  NormalizedOutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReply,
  QuickReplyValue,
} from '@jovotech/output';
import {
  GENERIC_TEMPLATE_MAX_SIZE,
  GENERIC_TEMPLATE_MIN_SIZE,
  MESSAGE_TEXT_MAX_LENGTH,
  QUICK_REPLY_TITLE_MAX_LENGTH,
} from './constants';
import {
  NormalizedFacebookMessengerOutputTemplate,
  FacebookMessengerResponse,
  GenericTemplate,
  Message as FacebookMessengerMessage,
  MessageAttachmentType,
  MessagingType,
  QuickReply as FacebookMessengerQuickReply,
  QuickReplyContentType,
  TemplateType,
} from './models';
import { convertMessageToFacebookMessengerMessage } from './utilities';

export class FacebookMessengerOutputTemplateConverterStrategy extends MultipleResponsesOutputTemplateConverterStrategy<
  FacebookMessengerResponse,
  OutputTemplateConverterStrategyConfig
> {
  responseClass = FacebookMessengerResponse;
  readonly platformName: string = 'facebookMessenger';

  // maybe we need more context here, like index of template
  protected sanitizeOutput(
    output: NormalizedOutputTemplate,
    index?: number,
  ): NormalizedOutputTemplate {
    const pathPrefix = index ? `[${index}]` : '';
    if (output.message) {
      output.message = this.sanitizeMessage(output.message, `${pathPrefix}.message`);
    }

    if (output.carousel) {
      output.carousel = this.sanitizeCarousel(output.carousel, `${pathPrefix}.carousel`);
    }

    if (output.quickReplies) {
      output.quickReplies = this.sanitizeQuickReplies(
        output.quickReplies,
        `${pathPrefix}.quickReplies`,
      );
    }

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

  protected sanitizeCarousel(
    carousel: Carousel,
    path: string,
    minSize = GENERIC_TEMPLATE_MIN_SIZE,
    maxSize = GENERIC_TEMPLATE_MAX_SIZE,
  ): Carousel {
    return super.sanitizeCarousel(carousel, path, minSize, maxSize);
  }

  protected sanitizeQuickReplies(
    quickReplies: QuickReplyValue[],
    path: string,
    maxSize = Infinity,
    maxLength = QUICK_REPLY_TITLE_MAX_LENGTH,
  ): QuickReplyValue[] {
    return super.sanitizeQuickReplies(quickReplies, path, maxSize, maxLength);
  }

  convertOutput(
    output: NormalizedOutputTemplate,
  ): FacebookMessengerResponse | FacebookMessengerResponse[] {
    const makeResponse: (message: FacebookMessengerMessage) => FacebookMessengerResponse = (
      message,
    ) =>
      this.normalizeResponse({
        messaging_type: MessagingType.Response,
        recipient: {
          id: '',
        },
        message,
      }) as FacebookMessengerResponse;
    const responses: FacebookMessengerResponse[] = [];

    const addMessageToResponses = (message: FacebookMessengerMessage) => {
      responses.push(makeResponse(message));
    };

    const message = output.message;
    if (message) {
      addMessageToResponses(convertMessageToFacebookMessengerMessage(message));
    }

    const card = output.card;
    if (card?.toFacebookMessengerMessage) {
      addMessageToResponses(card.toFacebookMessengerMessage());
    }

    const carousel = output.carousel;
    if (carousel?.toFacebookMessengerMessage) {
      addMessageToResponses(carousel.toFacebookMessengerMessage());
    }

    const platformOutput = output.platforms?.[this.platformName] as
      | NormalizedFacebookMessengerOutputTemplate
      | undefined;

    if (platformOutput?.template) {
      addMessageToResponses({
        attachment: {
          type: MessageAttachmentType.Template,
          payload: platformOutput.template,
        },
      });
    }

    if (platformOutput?.nativeResponse) {
      // TODO determine what to do with nativeResponse
    }

    const quickReplies = output.quickReplies;
    const nativeQuickReplies = platformOutput?.nativeQuickReplies;
    if (quickReplies?.length || nativeQuickReplies?.length) {
      const lastResponseWithMessage = responses
        .slice()
        .reverse()
        .find((response) => !!response.message);
      if (lastResponseWithMessage?.message) {
        lastResponseWithMessage.message.quick_replies = [];
        if (nativeQuickReplies?.length) {
          lastResponseWithMessage.message.quick_replies.push(...nativeQuickReplies);
        }
        if (quickReplies?.length) {
          lastResponseWithMessage.message.quick_replies.push(
            ...quickReplies.map(this.convertQuickReplyToFacebookMessengerQuickReply),
          );
        }
      }
    }

    return responses.length === 1 ? responses[0] : responses;
  }

  convertResponse(response: FacebookMessengerResponse): NormalizedOutputTemplate {
    const output: NormalizedOutputTemplate = {};

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
