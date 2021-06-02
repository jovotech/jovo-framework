import { Card, Carousel, Message } from '@jovotech/output';
import {
  AplRenderDocumentDirective,
  Card as AlexaCard,
  CardType,
  OutputSpeechType,
} from './models';
import AplCardJson from './apl/Card.json';
import AplCarouselJson from './apl/Carousel.json';
import AplListJson from './apl/List.json';
import { AplList } from './models/apl/AplList';

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

    // @ts-ignore
    const directive: AplRenderDocumentDirective = {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...AplCardJson,
    };
    return directive;
  };

  Carousel.prototype.toApl = function (): AplRenderDocumentDirective {
    if (this.header) {
      AplCarouselJson.datasources.data.header = this.header;
    }

    if (this.backgroundImageUrl) {
      AplCarouselJson.datasources.data.backgroundImageUrl = this.backgroundImageUrl;
    }

    (AplCarouselJson.datasources.data.items as Card[]) = this.items;

    // @ts-ignore
    const directive: AplRenderDocumentDirective = {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...AplCarouselJson,
    };
    return directive;
  };

  AplList.prototype.toApl = function (): AplRenderDocumentDirective {
    if (this.header) {
      AplListJson.datasources.data.header = this.header;
    }

    if (this.backgroundImageUrl) {
      AplListJson.datasources.data.backgroundImageUrl = this.backgroundImageUrl;
    }

    (AplListJson.datasources.data.items as Card[]) = this.items;

    // @ts-ignore
    const directive: AplRenderDocumentDirective = {
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'token',
      ...AplListJson,
    };
    return directive;
  };

  Message.prototype.toAlexaOutputSpeech = function () {
    return {
      type: OutputSpeechType.Ssml,
      ssml: this.text,
    };
  };
}
