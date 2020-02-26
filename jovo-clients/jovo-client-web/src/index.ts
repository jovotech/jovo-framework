export const VERSION = '0.1.0';

export {
  CorePlatformRequestJSON as CoreRequest,
  CorePlatformResponseJSON as CoreResponse,
} from 'jovo-platform-core/dist/src/Interfaces'; // tslint:disable-line

export * from 'jovo-platform-core/dist/src/Interfaces'; // tslint:disable-line

export * from './events';
export * from './core/CoreComponent';
export * from './core/Component';
export * from './util/AudioHelper';
export * from './util/Base64Converter';
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
