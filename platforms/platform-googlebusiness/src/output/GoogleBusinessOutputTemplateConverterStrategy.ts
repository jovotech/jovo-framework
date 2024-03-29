import {
  Card,
  Carousel,
  MultipleResponsesOutputTemplateConverterStrategy,
  NormalizedOutputTemplate,
  OutputTemplateConverterStrategyConfig,
  QuickReplyValue,
} from '@jovotech/output';
import { GoogleBusinessResponse } from '../GoogleBusinessResponse';
import {
  CARD_CONTENT_DESCRIPTION_MAX_LENGTH,
  CARD_CONTENT_TITLE_MAX_LENGTH,
  CAROUSEL_MAX_SIZE,
  CAROUSEL_MIN_SIZE,
  SUGGESTIONS_MAX_SIZE,
  SUGGESTION_TEXT_MAX_LENGTH,
} from './constants';
import { RepresentativeType, Suggestion } from './models';
import { convertMessageToGoogleBusinessText } from './utilities';

export class GoogleBusinessOutputTemplateConverterStrategy extends MultipleResponsesOutputTemplateConverterStrategy<
  GoogleBusinessResponse,
  OutputTemplateConverterStrategyConfig
> {
  responseClass = GoogleBusinessResponse;
  platformName = 'googleBusiness' as const;

  protected sanitizeOutput(
    output: NormalizedOutputTemplate,
    index?: number,
  ): NormalizedOutputTemplate {
    const pathPrefix = index ? `[${index}]` : '';

    if (output.card) {
      output.card = this.sanitizeCard(output.card, `${pathPrefix}.card`);
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

  protected sanitizeCard(card: Card, path: string): Card {
    if (!this.shouldSanitize('trimStrings')) {
      return card;
    }

    if (card.title.length > CARD_CONTENT_TITLE_MAX_LENGTH) {
      card.title = card.title.slice(0, CARD_CONTENT_TITLE_MAX_LENGTH);
      this.logStringTrimWarning(`${path}.title`, CARD_CONTENT_TITLE_MAX_LENGTH);
    }

    if (card.content && card.content.length > CARD_CONTENT_DESCRIPTION_MAX_LENGTH) {
      card.content = card.content.slice(0, CARD_CONTENT_DESCRIPTION_MAX_LENGTH);
      this.logStringTrimWarning(`${path}.content`, CARD_CONTENT_DESCRIPTION_MAX_LENGTH);
    }

    return card;
  }

  protected sanitizeQuickReplies(
    quickReplies: QuickReplyValue[],
    path: string,
    maxSize = SUGGESTIONS_MAX_SIZE,
    maxLength = SUGGESTION_TEXT_MAX_LENGTH,
  ): QuickReplyValue[] {
    return super.sanitizeQuickReplies(quickReplies, path, maxSize, maxLength);
  }

  protected sanitizeCarousel(
    carousel: Carousel,
    path: string,
    minSize = CAROUSEL_MIN_SIZE,
    maxSize = CAROUSEL_MAX_SIZE,
  ): Carousel {
    return super.sanitizeCarousel(carousel, path, minSize, maxSize);
  }

  convertOutput(
    output: NormalizedOutputTemplate,
  ): GoogleBusinessResponse | GoogleBusinessResponse[] {
    const getResponseBase: () => GoogleBusinessResponse = () =>
      this.normalizeResponse({
        messageId: '',
        representative: {
          representativeType: RepresentativeType.Bot,
        },
      }) as GoogleBusinessResponse;
    const responses: GoogleBusinessResponse[] = [];

    const addResponse = <KEY extends 'text' | 'image' | 'richCard'>(
      key: KEY,
      content: GoogleBusinessResponse[KEY],
    ) => {
      const newResult = getResponseBase();
      newResult[key] = content;
      responses.push(newResult);
    };

    const message = output.message;
    if (message) {
      addResponse('text', convertMessageToGoogleBusinessText(message));
    }

    const card = output.card;
    if (card?.toGoogleBusinessRichCard) {
      addResponse('richCard', card.toGoogleBusinessRichCard());
    }

    const carousel = output.carousel;
    if (carousel?.toGoogleBusinessRichCard) {
      addResponse('richCard', carousel.toGoogleBusinessRichCard());
    }

    const image = output.platforms?.googleBusiness?.image;
    if (image) {
      addResponse('image', image);
    }

    if (output.platforms?.googleBusiness?.nativeResponse) {
      // TODO determine what to do with nativeResponse!
    }

    const quickReplies = output.quickReplies;
    const suggestions = output.platforms?.googleBusiness?.suggestions;
    if (quickReplies?.length || suggestions?.length) {
      const lastResponseWithContent = responses
        .slice()
        .reverse()
        .find((response) => !!response.text || !!response.richCard);
      if (lastResponseWithContent) {
        lastResponseWithContent.suggestions = [];
        if (suggestions?.length) {
          lastResponseWithContent.suggestions.push(...suggestions);
        }
        if (quickReplies?.length) {
          lastResponseWithContent.suggestions.push(
            ...quickReplies.map(this.convertQuickReplyToGoogleBusinessSuggestion),
          );
        }
      }
    }

    const fallback = output.platforms?.googleBusiness?.fallback;
    // TODO fully determine whether this should be applied to all responses
    if (fallback) {
      responses.forEach((response) => {
        response.fallback = fallback;
      });
    }

    return responses.length === 1 ? responses[0] : responses;
  }

  convertResponse(response: GoogleBusinessResponse): NormalizedOutputTemplate {
    const output: NormalizedOutputTemplate = {};
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
