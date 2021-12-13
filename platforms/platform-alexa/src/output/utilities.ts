import {
  Card,
  Carousel,
  CarouselItem,
  Message,
  MessageValue,
  removeSSML,
  SpeechMessage,
  TextMessage,
  toSSML,
} from '@jovotech/output';
import AplCardJson from './apl/Card.json';
import AplCarouselJson from './apl/Carousel.json';
import { ALEXA_STRING_MAX_LENGTH } from './constants';
import {
  AplRenderDocumentDirective,
  Card as AlexaCard,
  CardType,
  OutputSpeech,
  OutputSpeechType,
} from './models';

export function validateAlexaString(value: unknown): string | undefined | null | void {
  if (typeof value !== 'string') {
    return '$property must be a string';
  }
  if (!value) {
    return '$property should not be empty';
  }
  if (value.length > ALEXA_STRING_MAX_LENGTH) {
    return `$property can not exceed ${ALEXA_STRING_MAX_LENGTH} characters`;
  }
  return;
}

export function convertMessageToOutputSpeech(message: MessageValue): OutputSpeech {
  if (typeof message === 'string') {
    return {
      type: OutputSpeechType.Ssml,
      ssml: toSSML(message),
    };
  }
  if (message.speech) {
    return {
      type: OutputSpeechType.Ssml,
      ssml: toSSML(message.speech),
    };
  }
  return {
    type: OutputSpeechType.Plain,
    text: removeSSML((message as TextMessage).text),
  };
}

export function augmentModelPrototypes(): void {
  Card.prototype.toAlexaCard = function (): AlexaCard<CardType.Standard> {
    const card: AlexaCard<CardType.Standard> = {
      type: CardType.Standard,
      title: this.title,
      text: this.content,
    };
    if (this.imageUrl) {
      card.image = {
        largeImageUrl: this.imageUrl,
      };
    }
    return card;
  };

  Card.prototype.toApl = function (): AplRenderDocumentDirective {
    AplCardJson.datasources.data.title = this.title;

    if (this.subtitle) {
      AplCardJson.datasources.data.subtitle = this.subtitle;
    }

    if (this.content) {
      AplCardJson.datasources.data.content = this.content;
    }

    if (this.imageUrl) {
      AplCardJson.datasources.data.imageUrl = this.imageUrl;
    }

    if (this.header) {
      AplCardJson.datasources.data.header = this.header;
    }

    if (this.backgroundImageUrl) {
      AplCardJson.datasources.data.backgroundImageUrl = this.backgroundImageUrl;
    }

    return {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...AplCardJson,
    };
  };

  Carousel.prototype.toApl = function (): AplRenderDocumentDirective {
    if (this.title) {
      AplCarouselJson.datasources.data.title = this.title;
    }

    if (this.header) {
      AplCarouselJson.datasources.data.header = this.header;
    }

    if (this.backgroundImageUrl) {
      AplCarouselJson.datasources.data.backgroundImageUrl = this.backgroundImageUrl;
    }

    (AplCarouselJson.datasources.data.items as CarouselItem[]) = this.items.map((item) => ({
      ...item,
      selection: item.selection
        ? {
            type: 'Selection',
            ...item.selection,
          }
        : undefined,
    }));

    return {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...AplCarouselJson,
    };
  };

  Message.prototype.toAlexaOutputSpeech = function () {
    return convertMessageToOutputSpeech(this as TextMessage | SpeechMessage);
  };
}
