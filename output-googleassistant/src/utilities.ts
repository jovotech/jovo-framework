import { Card, Carousel, Message, QuickReply } from '@jovotech/output';
import {
  Card as GoogleAssistantCard,
  Collection,
  Simple,
  TypeOverride,
  TypeOverrideMode,
} from './models';

export function augmentModelPrototypes(): void {
  Card.prototype.toGoogleAssistantCard = function () {
    const card: GoogleAssistantCard = {
      title: this.title,
    };
    if (this.subtitle) {
      card.subtitle = this.subtitle;
    }
    if (this.content) {
      card.text = this.content;
    }
    if (this.imageUrl) {
      card.image = {
        url: this.imageUrl,
        alt: this.title,
      };
    }
    return card;
  };

  Carousel.prototype.toGoogleAssistantCollectionData = function () {
    const typeOverride: TypeOverride = {
      name: this.selection?.entityType || '',
      typeOverrideMode: TypeOverrideMode.Replace,
      synonym: {
        entries: this.items.map((item, index) => {
          return {
            name: item.key || `ITEM_${index + 1}`,
            synonyms: [],
            display: {
              title: item.title,
              description: item.subtitle,
              image: item.imageUrl ? { alt: item.title, url: item.imageUrl } : undefined,
            },
          };
        }),
      },
    };

    const collection: Collection = {
      items: this.items.map((item, index) => {
        return {
          key: item.key || `ITEM_${index + 1}`,
        };
      }),
    };

    return { collection, typeOverride };
  };

  Message.prototype.toGoogleAssistantSimple = function () {
    const simple: Simple = {
      speech: this.text,
    };
    if (this.displayText) {
      simple.text = this.displayText;
    }
    return simple;
  };

  QuickReply.prototype.toGoogleAssistantSuggestion = function () {
    return {
      title: this.text,
    };
  };
}
