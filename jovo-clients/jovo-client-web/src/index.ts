declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
    webkitAudioContext?: new () => AudioContext;
    SpeechGrammarList?: new () => SpeechGrammarList;
    webkitSpeechGrammarList?: new () => SpeechGrammarList;
  }
}

import { EventEmitter } from 'events';

const TEST_FN = EventEmitter.prototype.emit;
EventEmitter.prototype.emit = function (event, args) {
  console.debug(`[${event.toString()}] ${JSON.stringify(args, undefined, 1)}`);
  return TEST_FN.call(this, event, args);
};

export const VERSION = '0.1.0';

export type {
  CorePlatformRequestJSON as WebRequest,
  CorePlatformResponseJSON as WebResponse,
} from 'jovo-platform-core';
// tslint:disable-next-line
export * from 'jovo-platform-core/dist/src/Interfaces';

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
