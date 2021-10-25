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

export type { CoreRequest, CoreResponse } from '@jovotech/platform-core';

export * from './interfaces';
export * from './utilities';
export * from './core/ActionHandler';
export * from './core/RepromptHandler';
export * from './core/SSMLHandler';
export * from './standalone/AudioPlayer';
export * from './standalone/AudioRecorder';
export * from './standalone/SpeechRecognizer';
export * from './standalone/SpeechSynthesizer';
export * from './standalone/Store';

export * from './Client';
