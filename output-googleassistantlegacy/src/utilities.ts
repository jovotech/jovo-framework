import {
  Card,
  Carousel,
  Message,
  MessageValue,
  QuickReply,
  removeSSML,
  SpeechMessage,
  TextMessage,
  toSSML,
} from '@jovotech/output';
import { BasicCard, CollectionItem, SimpleResponse } from './models';

export function convertMessageToGoogleAssistantSimpleResponse(
  message: MessageValue,
): SimpleResponse {
  if (typeof message === 'string') {
    return {
      ssml: toSSML(message),
      displayText: removeSSML(message),
    };
  }
  return {
    ssml: toSSML(message.speech || (message.text as string)),
    displayText: removeSSML(message.text || (message.speech as string)),
  };
}

export function augmentModelPrototypes(): void {
  Card.prototype.toGoogleAssistantBasicCard = function () {
    const basicCard: BasicCard = {
      title: this.title,
    };
    if (this.subtitle) {
      basicCard.subtitle = this.subtitle;
    }
    if (this.content) {
      basicCard.formattedText = this.content;
    }
    if (this.imageUrl) {
      basicCard.image = {
        url: this.imageUrl,
        accessibilityText: this.title,
      };
    }
    return basicCard;
  };

  Carousel.prototype.toGoogleAssistantCarousel = function () {
    return {
      items: this.items.map((item) => {
        const collectionItem: CollectionItem = {
          optionInfo: {
            key: item.key || item.title,
            synonyms: [],
          },
          title: item.title,
        };
        if (item.subtitle) {
          collectionItem.description = item.subtitle;
        }
        if (item.imageUrl) {
          collectionItem.image = {
            url: item.imageUrl,
            accessibilityText: item.title,
          };
        }
        return collectionItem;
      }),
    };
  };

  Message.prototype.toGoogleAssistantSimpleResponse = function () {
    return convertMessageToGoogleAssistantSimpleResponse(this as SpeechMessage | TextMessage);
  };

  QuickReply.prototype.toGoogleAssistantSuggestion = function () {
    return {
      title: this.text,
    };
  };
}
