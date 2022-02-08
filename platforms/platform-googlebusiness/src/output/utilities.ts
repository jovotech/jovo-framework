import {
  Card,
  Carousel,
  Message,
  MessageValue,
  QuickReply,
  removeSSML,
  SpeechMessage,
  TextMessage,
} from '@jovotech/output';
import { CardContent, CardWidth, MediaHeight } from './models';

export function convertMessageToGoogleBusinessText(message: MessageValue): string {
  return removeSSML(
    typeof message === 'string' ? message : message.text || (message.speech as string),
  );
}

export function augmentModelPrototypes(): void {
  Card.prototype.toGoogleBusinessCardContent = function () {
    const cardContent: CardContent = {};
    if (this.title) {
      cardContent.title = this.title;
    }
    if (this.content || this.subtitle) {
      cardContent.description = this.content || this.subtitle;
    }
    if (this.imageUrl) {
      cardContent.media = {
        height: MediaHeight.Medium,
        contentInfo: {
          fileUrl: this.imageUrl,
          altText: this.imageAlt || this.title,
        },
      };
    }
    if (this.suggestions) {
      cardContent.suggestions = this.suggestions;
    }
    return cardContent;
  };

  Card.prototype.toGoogleBusinessCard = function () {
    return {
      cardContent: this.toGoogleBusinessCardContent!(),
    };
  };

  Card.prototype.toGoogleBusinessRichCard = function () {
    return {
      standaloneCard: this.toGoogleBusinessCard!(),
    };
  };

  Carousel.prototype.toGoogleBusinessCarousel = function () {
    return {
      cardWidth: CardWidth.Medium,
      cardContents: this.items.map((card) => card.toGoogleBusinessCardContent!()),
    };
  };

  Carousel.prototype.toGoogleBusinessRichCard = function () {
    if (this.items.length === 1) {
      return {
        standaloneCard: {
          cardContent: this.items[0].toGoogleBusinessCardContent!(),
        },
      };
    }

    return {
      carouselCard: this.toGoogleBusinessCarousel!(),
    };
  };

  Message.prototype.toGoogleBusinessText = function () {
    return convertMessageToGoogleBusinessText(this as SpeechMessage | TextMessage);
  };

  QuickReply.prototype.toGoogleBusinessSuggestion = function () {
    return {
      reply: {
        text: this.text,
        postbackData: this.value || this.text,
      },
    };
  };
}
