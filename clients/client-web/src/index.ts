declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
    webkitAudioContext?: new () => AudioContext;
    SpeechGrammarList?: new () => SpeechGrammarList;
    webkitSpeechGrammarList?: new () => SpeechGrammarList;

    JovoWebClient: typeof import('.');
  }
}

export * from '@jovotech/common';

export type {
  Card,
  Carousel,
  CarouselItem,
  CarouselItemSelection,
  CarouselSelection,
  DenormalizePlatformOutputTemplate,
  DenormalizeOutputTemplate,
  DynamicEntity,
  DynamicEntitiesModeLike,
  DynamicEntities,
  DynamicEntityValue,
  DynamicEntitiesMode,
  Entity,
  JovoResponse,
  Listen,
  ListenValue,
  Message,
  MessageValue,
  NormalizedOutputTemplate,
  NormalizedPlatformOutputTemplate,
  NormalizedOutputTemplatePlatforms,
  OutputTemplate,
  OutputTemplateBase,
  OutputTemplatePlatforms,
  PlatformOutputTemplate,
  QuickReply,
  QuickReplyValue,
} from '@jovotech/output';

export * from './interfaces';
export * from './utilities';

export * from './core/RepromptProcessor';
export * from './core/SSMLProcessor';

export * from './errors/NotInitializedError';

export * from './standalone/AudioPlayer';
export * from './standalone/AudioRecorder';
export * from './standalone/SpeechRecognizer';
export * from './standalone/SpeechSynthesizer';
export * from './standalone/Store';

export * from './Client';
