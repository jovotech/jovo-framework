import {
  Card,
  Carousel,
  mergeInstances,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReplyValue,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import {
  BASIC_CARD_TEXT_MAX_LENGTH,
  BASIC_CARD_WITH_IMAGE_TEXT_MAX_LENGTH,
  CAROUSEL_MAX_SIZE,
  CAROUSEL_MIN_SIZE,
  GoogleAssistantResponse,
  Suggestion,
  SUGGESTION_TITLE_MAX_LENGTH,
  SUGGESTIONS_MAX_SIZE,
} from './index';
import { convertMessageToGoogleAssistantSimpleResponse } from './utilities';

// TODO: CHECK: Theoretically, this platform can have multiple messages but we have never used this feature so far.
// In case we want to support that, the implementation of this strategy has to be adjusted.
export class GoogleAssistantOutputTemplateConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<
  GoogleAssistantResponse,
  OutputTemplateConverterStrategyConfig
> {
  platformName = 'googleAssistant' as const;
  responseClass = GoogleAssistantResponse;

  protected sanitizeOutput(output: OutputTemplate): OutputTemplate {
    if (output.quickReplies) {
      output.quickReplies = this.sanitizeQuickReplies(output.quickReplies, 'quickReplies');
    }

    if (output.card) {
      output.card = this.sanitizeCard(output.card, 'card');
    }

    if (output.carousel) {
      output.carousel = this.sanitizeCarousel(output.carousel, 'carousel');
    }
    return output;
  }

  protected sanitizeQuickReplies(
    quickReplies: QuickReplyValue[],
    path: string,
    maxSize = SUGGESTIONS_MAX_SIZE,
    maxLength = SUGGESTION_TITLE_MAX_LENGTH,
  ): QuickReplyValue[] {
    return super.sanitizeQuickReplies(quickReplies, path, maxSize, maxLength);
  }

  protected sanitizeCard(card: Card, path: string): Card {
    const maxLength = card.imageUrl
      ? BASIC_CARD_WITH_IMAGE_TEXT_MAX_LENGTH
      : BASIC_CARD_TEXT_MAX_LENGTH;
    if (!this.shouldSanitize('trimStrings') || !card.content || card.content.length <= maxLength) {
      return card;
    }
    card.content = card.content.slice(0, maxLength);
    this.logStringTrimWarning(path, maxLength);
    return card;
  }

  protected sanitizeCarousel(
    carousel: Carousel,
    path: string,
    minSize = CAROUSEL_MIN_SIZE,
    maxSize = CAROUSEL_MAX_SIZE,
  ): Carousel {
    return super.sanitizeCarousel(carousel, path, minSize, maxSize);
  }

  toResponse(output: OutputTemplate): GoogleAssistantResponse {
    const response: GoogleAssistantResponse = this.prepareResponse({
      richResponse: {
        items: [],
      },
    });

    const listen = output.listen ?? true;
    response.expectUserResponse = !!listen;

    const message = output.message;
    if (message) {
      response.richResponse.items.push({
        simpleResponse: convertMessageToGoogleAssistantSimpleResponse(message),
      });
    }

    const reprompt = output.reprompt;
    if (reprompt) {
      response.noInputPrompts = [convertMessageToGoogleAssistantSimpleResponse(reprompt)];
    }

    const quickReplies = output.quickReplies;
    if (quickReplies?.length) {
      response.richResponse.suggestions = quickReplies.map(this.convertQuickReplyToSuggestion);
    }

    const card = output.card;
    if (card) {
      response.richResponse.items.push({
        basicCard: card.toGoogleAssistantBasicCard?.(),
      });
    }

    const carousel = output.carousel;
    if (carousel) {
      response.systemIntent = {
        intent: 'actions.intent.OPTION',
        data: {
          '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
          'carouselSelect': carousel.toGoogleAssistantCarousel?.(),
        },
      };
    }

    if (output.platforms?.googleAssistant?.nativeResponse) {
      mergeInstances(response, output.platforms.googleAssistant.nativeResponse);
    }

    return response;
  }

  fromResponse(response: GoogleAssistantResponse): OutputTemplate {
    const output: OutputTemplate = {};

    const simpleResponse = response.richResponse?.items?.[0]?.simpleResponse;
    if (simpleResponse?.ssml && simpleResponse?.toMessage) {
      output.message = simpleResponse.toMessage();
    }

    if (response.noInputPrompts?.length) {
      output.reprompt = response.noInputPrompts[0].toMessage?.();
    }

    if (typeof response.expectUserResponse === 'boolean') {
      output.listen = response.expectUserResponse;
    }

    const suggestions = response.richResponse.suggestions;
    if (suggestions?.length) {
      output.quickReplies = suggestions.map((suggestion) => {
        return suggestion.toQuickReply!();
      });
    }

    const basicCard = response.richResponse.items.find((item) => item.basicCard)?.basicCard;
    if (basicCard?.toCard) {
      output.card = basicCard?.toCard();
    }

    if (
      response.systemIntent?.intent === 'actions.intent.OPTION' &&
      response.systemIntent?.data?.carouselSelect
    ) {
      output.carousel = response.systemIntent.data.carouselSelect.toCarousel?.();
    }

    return output;
  }

  convertQuickReplyToSuggestion(quickReply: QuickReplyValue): Suggestion {
    return typeof quickReply === 'string'
      ? { title: quickReply }
      : quickReply.toGoogleAssistantSuggestion?.() || {
          title: quickReply.text,
        };
  }
}
