import { Card, Carousel, Message, QuickReply } from '@jovotech/output';
import { CardWidth, MediaHeight, StandaloneCard } from './models';

export function augmentModelPrototypes(): void {
  Card.prototype.toGoogleBusinessCard = function () {
    const card: StandaloneCard = {
      cardContent: {},
    };
    if (this.title) {
      card.cardContent.title = this.title;
    }
    if (this.content || this.subtitle) {
      card.cardContent.description = this.content || this.subtitle;
    }
    if (this.imageUrl) {
      card.cardContent.media = {
        height: MediaHeight.Medium,
        contentInfo: {
          fileUrl: this.imageUrl,
          altText: this.imageAlt || this.title,
        },
      };
    }
    return card;
  };

  Card.prototype.toGoogleBusinessRichCard = function () {
    return {
      standaloneCard: this.toGoogleBusinessCard!(),
    };
  };

  Carousel.prototype.toGoogleBusinessCarousel = function () {
    return {
      cardWidth: CardWidth.Medium,
      cardContents: this.items.map((card) => card.toGoogleBusinessCard?.() || {}),
    };
  };

  Carousel.prototype.toGoogleBusinessRichCard = function () {
    return {
      carouselCard: this.toGoogleBusinessCarousel!(),
    };
  };

  Message.prototype.toGoogleBusinessText = function () {
    return this.text;
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
