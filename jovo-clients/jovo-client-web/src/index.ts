import 'whatwg-fetch';

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

export type {
  CorePlatformRequestJSON as WebRequest,
  CorePlatformResponseJSON as WebResponse,
} from 'jovo-platform-web';
// tslint:disable-next-line
export * from 'jovo-platform-web/dist/src/Interfaces'; // ugly fix but best way to only re-export what is needed

export * from './types';
export * from './util';
export * from './core/ActionHandler';
export * from './core/RepromptHandler';
export * from './core/SSMLHandler';
export * from './standalone/AudioPlayer';
export * from './standalone/AudioRecorder';
export * from './standalone/SpeechRecognizer';
export * from './standalone/SpeechSynthesizer';
export * from './standalone/Store';

export * from './Client';
