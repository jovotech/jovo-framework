import { SsmlUtilities } from '@jovotech/common';
import {
  Card,
  Carousel,
  CarouselItem,
  Message,
  MessageValue,
  SpeechMessage,
  TextMessage,
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
      ssml: SsmlUtilities.toSSML(message),
    };
  }
  if (message.speech) {
    return {
      type: OutputSpeechType.Ssml,
      ssml: SsmlUtilities.toSSML(message.speech),
    };
  }
  return {
    type: OutputSpeechType.Plain,
    text: SsmlUtilities.removeSSML((message as TextMessage).text),
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
        // TODO: determine whether large should always be set
        largeImageUrl: this.imageUrl,
      };
    }
    return card;
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Card.prototype.toApl = function (cardTemplate?: any): AplRenderDocumentDirective {
    const cardJson = cardTemplate || AplCardJson;
    cardJson.datasources.data.title = this.title;

    if (this.subtitle) {
      cardJson.datasources.data.subtitle = this.subtitle;
    }

    if (this.content) {
      cardJson.datasources.data.content = this.content;
    }

    if (this.imageUrl) {
      cardJson.datasources.data.imageUrl = this.imageUrl;
    }

    if (this.header) {
      cardJson.datasources.data.header = this.header;
    }

    if (this.backgroundImageUrl) {
      cardJson.datasources.data.backgroundImageUrl = this.backgroundImageUrl;
    }

    return {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...cardJson,
    };
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Carousel.prototype.toApl = function (carouselTemplate?: any): AplRenderDocumentDirective {
    const carouselJson = carouselTemplate || AplCarouselJson;

    if (this.title) {
      carouselJson.datasources.data.title = this.title;
    }

    if (this.header) {
      carouselJson.datasources.data.header = this.header;
    }

    if (this.backgroundImageUrl) {
      carouselJson.datasources.data.backgroundImageUrl = this.backgroundImageUrl;
    }

    (carouselJson.datasources.data.items as CarouselItem[]) = this.items.map((item) => ({
      ...item,
      selection: item.selection
        ? {
            type: 'Selection',
            ...item.selection,
          }
        : undefined,

      // map generic carousel properties to AlexaImageList.listItems properties
      // https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-alexa-image-list-layout.html#list-items
      primaryText: item.title,
      secondaryText: item.subtitle || item.content,
      imageSource: item.imageUrl,
    }));

    return {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...carouselJson,
    };
  };

  Message.prototype.toAlexaOutputSpeech = function () {
    return convertMessageToOutputSpeech(this as TextMessage | SpeechMessage);
  };
}
