import {
  Card,
  Carousel,
  MessageValue,
  MultipleResponsesOutputTemplateConverterStrategy,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReply,
  QuickReplyValue,
  removeSSML,
} from '@jovotech/output';
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

  // TODO: improve code
  convertTemplate(output: OutputTemplate): FacebookMessengerResponse | FacebookMessengerResponse[] {
    const getResponseBase: () => FacebookMessengerResponse = () => ({
      messaging_type: MessagingType.Response,
      recipient: {
        id: '',
      },
    });
    let response: FacebookMessengerResponse | FacebookMessengerResponse[] = getResponseBase();

    const addToResponse = (message: FacebookMessengerMessage) => {
      if (!Array.isArray(response) && response.message) {
        response = [response];
      }
      if (Array.isArray(response)) {
        const newResponse = getResponseBase();
        newResponse.message = message;
        response.push(newResponse);
      } else {
        response.message = message;
      }
    };

    const conversionMap: Partial<
      Record<keyof OutputTemplate, (val: any) => FacebookMessengerMessage>
    > = {
      message: (message: MessageValue) => this.convertMessageToFacebookMessengerMessage(message),
      card: (card: Card) => ({
        attachment: {
          type: MessageAttachmentType.Template,
          payload: card.toFacebookMessengerGenericTemplate!(),
        },
      }),
      carousel: (carousel: Carousel) => ({
        attachment: {
          type: MessageAttachmentType.Template,
          payload: carousel.toFacebookMessengerGenericTemplate!(),
        },
      }),
    };

    const enumerateOutputTemplate = (outputTemplate: OutputTemplate) => {
      for (const key in outputTemplate) {
        if (outputTemplate.hasOwnProperty(key) && outputTemplate[key]) {
          const conversionFn = conversionMap[key];
          if (conversionFn) {
            addToResponse(conversionFn(outputTemplate[key]));
          }
        }
      }
    };

    enumerateOutputTemplate(output);
    if (output.platforms?.FacebookMessenger) {
      enumerateOutputTemplate(output.platforms.FacebookMessenger);
    }

    // TODO determine what to do with nativeResponse!
    // if (output.platforms?.FacebookMessenger?.nativeResponse) {
    // }

    return response;
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
