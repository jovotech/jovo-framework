import { SsmlUtilities } from '@jovotech/common';
import {
  Card,
  Carousel,
  Message,
  MessageValue,
  QuickReply,
  SpeechMessage,
  TextMessage,
} from '@jovotech/output';
import {
  Card as GoogleAssistantCard,
  Collection,
  Simple,
  TypeOverride,
  TypeOverrideMode,
} from './models';

export function convertMessageToGoogleAssistantSimple(message: MessageValue): Simple {
  if (typeof message === 'string') {
    return {
      speech: SsmlUtilities.toSSML(message),
      text: SsmlUtilities.removeSSML(message),
    };
  }

  return {
    speech: SsmlUtilities.toSSML(message.speech || (message.text as string)),
    text: SsmlUtilities.removeSSML(message.text || (message.speech as string)),
  };
}

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

  Carousel.prototype.toGoogleAssistantCard = function () {
    const { title, subtitle, content, imageUrl } = this.items[0];
    const card: GoogleAssistantCard = {
      title: this.title || title,
      subtitle,
      text: content,
      image: imageUrl
        ? {
            url: imageUrl,
            alt: title,
          }
        : undefined,
    };

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
              description: item.subtitle || item.content,
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
    return convertMessageToGoogleAssistantSimple(this as SpeechMessage | TextMessage);
  };

  QuickReply.prototype.toGoogleAssistantSuggestion = function () {
    return {
      title: this.text,
    };
  };
}
