import { Card, Carousel, Message } from '@jovotech/output';
import AplCardJson from './apl/Card.json';
import AplCarouselJson from './apl/Carousel.json';
import {
  AplRenderDocumentDirective,
  Card as AlexaCard,
  CardType,
  OutputSpeechType,
} from './models';

export function validateAlexaString(value: unknown): string | undefined | null | void {
  if (typeof value !== 'string') {
    return '$property must be a string';
  }
  if (!value) {
    return '$property should not be empty';
  }
  if (value.length > 8000) {
    return '$property can not exceed 8000 characters';
  }
  return;
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

    (AplCarouselJson.datasources.data.items as Card[]) = this.items;

    return {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...AplCarouselJson,
    };
  };

  Message.prototype.toAlexaOutputSpeech = function () {
    return {
      type: OutputSpeechType.Ssml,
      ssml: this.text,
    };
  };
}
