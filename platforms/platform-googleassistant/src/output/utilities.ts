import {
  Card,
  Carousel,
  Message,
  MessageValue,
  QuickReply,
  RichAudio,
  Audio,
  Sequencer,
  Mixer,
  Speech,
  Silence,
  removeSSML,
  SpeechMessage,
  TextMessage,
  toSSML,
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
      speech: toSSML(message),
      text: removeSSML(message),
    };
  }

  return {
    speech: toSSML(message.speech || (message.text as string)),
    text: removeSSML(message.text || (message.speech as string)),
  };
}

const isAudioElem = (elem: RichAudio): elem is Audio => elem.type === 'Audio';
const isSpeechElem = (elem: RichAudio): elem is Speech => elem.type === 'Speech';
const isSilenceElem = (elem: RichAudio): elem is Silence => elem.type === 'Silence';
const isSequencerElem = (elem: RichAudio): elem is Sequencer => elem.type === 'Sequencer';
const isMixerElem = (elem: RichAudio): elem is Mixer => elem.type === 'Mixer';

function genChildSSML(elem: RichAudio): string {
  if (elem.type === 'Mixer' || elem.type === 'Sequencer') {
    return genRichAudioSSML(elem);
  }
  return `<media>${genRichAudioSSML(elem)}</media>`;
}

function getContentString(content: MessageValue): string {
  if (typeof content === 'string') {
    return content;
  }

  return content.text || '';
}

export function genRichAudioSSML(elem: RichAudio): string {
  if (isAudioElem(elem)) {
    return `<audio src="${elem.source}" />`;
  }
  if (isSpeechElem(elem)) {
    return `<p>${getContentString(elem.content)}</p>`;
  }
  if (isSilenceElem(elem)) {
    return `<break time="${elem.duration}ms" />`;
  }
  if (isSequencerElem(elem)) {
    return `<seq>${elem.items.map(genChildSSML).join('')}</seq>`;
  }
  if (isMixerElem(elem)) {
    return `<par>${elem.items.map(genChildSSML).join('')}</par>`;
  }

  throw new Error(`Unrecognised RichAudio item: ${elem}`);
}

export function genRichAudioText(elem: RichAudio): string {
  if (isAudioElem(elem)) {
    return '';
  }
  if (isSpeechElem(elem)) {
    return getContentString(elem.content);
  }
  if (isSilenceElem(elem)) {
    return '';
  }
  if (isSequencerElem(elem)) {
    return elem.items
      .map(genRichAudioText)
      .filter((e) => !!e)
      .join('. ');
  }
  if (isMixerElem(elem)) {
    return elem.items
      .map(genRichAudioText)
      .filter((e) => !!e)
      .join('. ');
  }

  throw new Error(`Unrecognised RichAudio item: ${elem}`);
}

export function convertRichAudioToGoogleAssistantSimple(richAudio: RichAudio): Simple {
  return {
    speech: genRichAudioSSML(richAudio),
    text: genRichAudioText(richAudio),
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
    return convertMessageToGoogleAssistantSimple(this as SpeechMessage | TextMessage);
  };

  QuickReply.prototype.toGoogleAssistantSuggestion = function () {
    return {
      title: this.text,
    };
  };
}
