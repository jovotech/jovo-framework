import { GenericCard, GenericMessage } from '@jovotech/output';
import { Card, CardType, OutputSpeechType, PlayBehavior } from './models';

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

export function augmentGenericPrototypes(): void {
  GenericCard.prototype.toAlexaCard = function () {
    const card: Card<CardType.Standard> = {
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

  GenericMessage.prototype.toAlexaOutputSpeech = function () {
    return {
      type: OutputSpeechType.Ssml,
      ssml: this.text,
    };
  };
}
