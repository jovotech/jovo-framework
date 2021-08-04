import {
  Card,
  Carousel,
  MessageValue,
  MultipleResponsesOutputTemplateConverterStrategy,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReplyValue,
  removeSSML,
} from '@jovotech/output';
import { GoogleBusinessResponse, RepresentativeType, Suggestion } from './models';

export class GoogleBusinessOutputTemplateConverterStrategy extends MultipleResponsesOutputTemplateConverterStrategy<
  GoogleBusinessResponse,
  OutputTemplateConverterStrategyConfig
> {
  responseClass = GoogleBusinessResponse;

  // TODO improve code
  convertTemplate(output: OutputTemplate): GoogleBusinessResponse {
    const getResponseBase: () => GoogleBusinessResponse = () => ({
      // TODO determine whether uuid should be used here or that's something that the developer has to do
      messageId: '*',
      representative: {
        representativeType: RepresentativeType.Bot,
      },
    });
    let response: GoogleBusinessResponse | GoogleBusinessResponse[] = getResponseBase();

    const addToResponse = <KEY extends 'text' | 'image' | 'richCard'>(
      key: KEY,
      content: GoogleBusinessResponse[KEY],
    ) => {
      if (!Array.isArray(response) && (response.text || response.image || response.richCard)) {
        response = [response];
      }
      if (Array.isArray(response)) {
        const newResponse = getResponseBase();
        newResponse[key] = content;
        response.push(newResponse);
      } else {
        response[key] = content;
      }
    };

    const conversionMap: Partial<
      Record<
        keyof OutputTemplate,
        (
          val: any,
        ) =>
          | GoogleBusinessResponse['text']
          | GoogleBusinessResponse['image']
          | GoogleBusinessResponse['richCard']
      >
    > = {
      message: (message: MessageValue) => this.convertMessageToGoogleBusinessText(message),
      card: (card: Card) => ({ standaloneCard: card.toGoogleBusinessCard!() }),
      carousel: (carousel: Carousel) => ({ carouselCard: carousel.toGoogleBusinessCarousel!() }),
    };

    const responseKeyMap: Record<keyof OutputTemplate, 'text' | 'image' | 'richCard' | undefined> =
      {
        message: 'text',
        card: 'richCard',
        carousel: 'richCard',
      };

    const enumerateOutputTemplate = (outputTemplate: OutputTemplate) => {
      for (const key in outputTemplate) {
        if (outputTemplate.hasOwnProperty(key) && outputTemplate[key]) {
          const conversionFn = conversionMap[key];
          const responseKey = responseKeyMap[key];
          if (conversionFn && responseKey) {
            addToResponse(responseKey, conversionFn(outputTemplate[key]));
          }
        }
      }
    };

    enumerateOutputTemplate(output);
    if (output.platforms?.GoogleBusiness) {
      enumerateOutputTemplate(output.platforms.GoogleBusiness);
    }

    // TODO determine what to do with nativeResponse!
    // if (output.platforms?.GoogleBusiness?.nativeResponse) {
    // }

    return response;
  }

  convertResponse(response: GoogleBusinessResponse): OutputTemplate {
    const output: OutputTemplate = {};
    if (response.text) {
      output.message = response.text;
    }
    if (response.richCard?.standaloneCard?.toCard) {
      output.card = response.richCard.standaloneCard.toCard();
    }
    if (response.richCard?.carouselCard?.toCarousel) {
      output.carousel = response.richCard.carouselCard.toCarousel();
    }
    if (response.suggestions?.length) {
      output.quickReplies = response.suggestions.map((suggestion) => suggestion.toQuickReply!());
    }
    return output;
  }

  convertMessageToGoogleBusinessText(message: MessageValue): string {
    return removeSSML(
      typeof message === 'string' ? message : message.toGoogleBusinessText?.() || message.text,
    );
  }

  convertQuickReplyToGoogleBusinessSuggestion(quickReply: QuickReplyValue): Suggestion {
    return typeof quickReply === 'string'
      ? { reply: { text: quickReply, postbackData: quickReply } }
      : quickReply.toGoogleBusinessSuggestion?.() || {
          reply: {
            text: quickReply.text,
            postbackData: quickReply.value || quickReply.text,
          },
        };
  }
}
