import {
  Card,
  Carousel,
  mergeInstances,
  MessageValue,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReplyValue,
  SingleResponseOutputTemplateConverterStrategy,
  toSSML,
} from '@jovotech/output';
import {
  BASIC_CARD_TEXT_MAX_LENGTH,
  BASIC_CARD_WITH_IMAGE_TEXT_MAX_LENGTH,
  CAROUSEL_MAX_SIZE,
  CAROUSEL_MIN_SIZE,
  GoogleAssistantResponse,
  SimpleResponse,
  Suggestion,
  SUGGESTION_TITLE_MAX_LENGTH,
  SUGGESTIONS_MAX_SIZE,
} from './index';

// TODO: CHECK: Theoretically, this platform can have multiple messages but we have never used this feature so far.
// In case we want to support that, the implementation of this strategy has to be adjusted.
export class GoogleAssistantOutputTemplateConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<
  GoogleAssistantResponse,
  OutputTemplateConverterStrategyConfig
> {
  platformName = 'GoogleAssistant';
  responseClass = GoogleAssistantResponse;

  protected sanitizeOutput(output: OutputTemplate): OutputTemplate {
    if (output.platforms?.GoogleAssistant?.quickReplies) {
      output.platforms.GoogleAssistant.quickReplies = this.sanitizeQuickReplies(
        output.platforms.GoogleAssistant.quickReplies,
        'platforms.GoogleAssistant.quickReplies',
      );
    } else if (output.quickReplies) {
      output.quickReplies = this.sanitizeQuickReplies(output.quickReplies, 'quickReplies');
    }

    if (output.platforms?.GoogleAssistant?.card) {
      output.platforms.GoogleAssistant.card = this.sanitizeCard(
        output.platforms.GoogleAssistant.card,
        'platforms.GoogleAssistant.card',
      );
    } else if (output.card) {
      output.card = this.sanitizeCard(output.card, 'card');
    }

    if (output.platforms?.GoogleAssistant?.carousel) {
      output.platforms.GoogleAssistant.carousel = this.sanitizeCarousel(
        output.platforms.GoogleAssistant.carousel,
        'platforms.GoogleAssistant.carousel',
      );
    } else if (output.carousel) {
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
    if (!this.shouldSanitize('maxLength') || !card.content || card.content.length <= maxLength) {
      return card;
    }
    card.content = card.content.slice(0, maxLength);
    this.logStringTruncationWarning(path, maxLength);
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
    const response: GoogleAssistantResponse = {
      richResponse: {
        items: [],
      },
    };

    // TODO: fully determine when to set listen
    const listen = output.platforms?.GoogleAssistant?.listen ?? output.listen;
    if (typeof listen !== 'undefined') {
      response.expectUserResponse = !!listen;
    }

    const message = output.platforms?.GoogleAssistant?.message || output.message;
    if (message) {
      response.richResponse.items.push({
        simpleResponse: this.convertMessageToSimpleResponse(message),
      });
    }

    const reprompt = output.platforms?.GoogleAssistant?.reprompt || output.reprompt;
    if (reprompt) {
      response.noInputPrompts = [this.convertMessageToSimpleResponse(reprompt)];
    }

    const quickReplies = output.platforms?.GoogleAssistant?.quickReplies || output.quickReplies;
    if (quickReplies?.length) {
      response.richResponse.suggestions = quickReplies.map(this.convertQuickReplyToSuggestion);
    }

    const card = output.platforms?.GoogleAssistant?.card || output.card;
    if (card) {
      response.richResponse.items.push({
        basicCard: card.toGoogleAssistantBasicCard?.(),
      });
    }

    const carousel = output.platforms?.GoogleAssistant?.carousel || output.carousel;
    if (carousel) {
      response.systemIntent = {
        intent: 'actions.intent.OPTION',
        data: {
          '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
          'carouselSelect': carousel.toGoogleAssistantCarousel?.(),
        },
      };
    }

    if (output.platforms?.GoogleAssistant?.nativeResponse) {
      mergeInstances(response, output.platforms.GoogleAssistant.nativeResponse);
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

  convertMessageToSimpleResponse(message: MessageValue): SimpleResponse {
    return typeof message === 'string'
      ? { ssml: toSSML(message) }
      : message.toGoogleAssistantSimpleResponse?.() || {
          ssml: toSSML(message.text),
          displayText: message.displayText,
        };
  }

  convertQuickReplyToSuggestion(quickReply: QuickReplyValue): Suggestion {
    return typeof quickReply === 'string'
      ? { title: quickReply }
      : quickReply.toGoogleAssistantSuggestion?.() || {
          title: quickReply.text,
        };
  }
}
