import { Card, Message } from '@jovotech/output';
import { Card as AlexaCard, CardType, OutputSpeechType } from './models';

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
  Card.prototype.toAlexaCard = function () {
    const card: AlexaCard<CardType.Standard> = {
      type: CardType.Standard,
      title: this.title,
      text: this.subtitle,
    };
    if (this.imageUrl) {
      card.image = {
        // TODO: determine whether large should always be set
        largeImageUrl: this.imageUrl,
      };
    }
    return card;
  };

  Message.prototype.toAlexaOutputSpeech = function () {
    return {
      type: OutputSpeechType.Ssml,
      ssml: this.text,
    };
  };
}
