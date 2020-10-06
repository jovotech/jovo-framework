declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
    webkitAudioContext?: new () => AudioContext;
    SpeechGrammarList?: new () => SpeechGrammarList;
    webkitSpeechGrammarList?: new () => SpeechGrammarList;
  }
}

export const VERSION = '0.1.0';

export type {
  CorePlatformRequestJSON as WebRequest,
  CorePlatformResponseJSON as WebResponse,
} from 'jovo-platform-core';
// tslint:disable-next-line
export * from 'jovo-platform-core/dist/src/Interfaces';

export * as StandaloneAudioPlayer from './standalone/AudioPlayer';
export * as StandaloneAudioRecorder from './standalone/AudioRecorder';
export * as StandaloneSpeechRecognizer from './standalone/SpeechRecognizer';
export * as StandaloneSpeechSynthesizer from './standalone/SpeechSynthesizer';
export * as StandaloneStore from './standalone/Store';
export * from './types';
export * as StandaloneClient from './Client';
export * from './util';

export * from './events';
export * from './core/CoreComponent';
export * from './core/Component';
export * from './core/AdvancedEventEmitter';
export * from './core/AudioPlayer';
export * from './core/Interfaces';
export * from './core/SpeechSynthesizer';
export * from './core/SSMLEvaluator';
export * from './core/Store';
export * from './components/conversation/ConversationComponent';
export * from './components/conversation/Interfaces';
export * from './components/input/AudioRecorder';
export * from './components/input/AudioVisualizer';
export * from './components/input/InputComponent';
export * from './components/input/Interfaces';
export * from './components/logger/Interfaces';
export * from './components/logger/LoggerComponent';
export * from './components/request/Interfaces';
export * from './components/request/NetworkHandler';
export * from './components/request/RequestComponent';
export * from './components/request/adapters/AjaxAdapter';
export * from './components/response/RepromptTimer';
export * from './components/response/ResponseComponent';
export { JovoWebClient, DefaultInputMode } from './JovoWebClient';
