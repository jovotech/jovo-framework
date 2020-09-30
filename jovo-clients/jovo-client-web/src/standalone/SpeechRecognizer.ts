import { EventEmitter } from 'events';
import _defaults from 'lodash.defaults';
import { DeepPartial, ErrorListener, VoidListener } from '../types';

export enum SpeechRecognizerEvent {
  Start = 'start',
  Stop = 'stop',
  Abort = 'abort',
  SpeechRecognized = 'speechRecognized',
  SilenceDetected = 'silenceDetected',
  Error = 'error',
  End = 'end',
}

export type SpeechRecognizerSpeechRecognizedListener = (event: SpeechRecognitionEvent) => void;
export type SpeechRecognizerVoidEvents =
  | SpeechRecognizerEvent.Start
  | SpeechRecognizerEvent.Stop
  | SpeechRecognizerEvent.Abort
  | SpeechRecognizerEvent.SilenceDetected
  | SpeechRecognizerEvent.End;
export interface SpeechRecognizerSilenceDetectionConfig {
  enabled: boolean;
  timeoutInMs: number;
}

export type SpeechRecognitionConfig = Pick<
  SpeechRecognition,
  'continuous' | 'grammars' | 'interimResults' | 'lang' | 'maxAlternatives'
>;

export interface SpeechRecognizerConfig extends SpeechRecognitionConfig {
  silenceDetection: SpeechRecognizerSilenceDetectionConfig;
}

// TODO determine how to handle case where recognition is not available (Safari for example)
export class SpeechRecognizer extends EventEmitter {
  static getDefaultConfig(): SpeechRecognizerConfig {
    return {
      // TODO maybe replace with browser lang
      lang: 'en-US',
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      grammars: new window.SpeechGrammarList(),
      silenceDetection: {
        enabled: false,
        timeoutInMs: 1500,
      },
    };
  }

  readonly config: SpeechRecognizerConfig;

  private readonly recognition: SpeechRecognition | null = null;

  private recording = false;

  private silenceDetectionTimeoutId?: number;

  constructor(config?: DeepPartial<SpeechRecognizerConfig>) {
    super();
    window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // TODO determine how to handle case when SpeechGrammarList is not defined, maybe just make it optional in the config
    const defaultConfig = SpeechRecognizer.getDefaultConfig();
    this.config = config ? _defaults(config, defaultConfig) : defaultConfig;

    if (window.SpeechRecognition) {
      this.recognition = new window.SpeechRecognition();
      this.setupSpeechRecognition(this.recognition);
    }
  }

  get silenceDetectionEnabled(): boolean {
    return !!(
      this.config.continuous &&
      this.config.interimResults &&
      this.config.silenceDetection.enabled &&
      this.config.silenceDetection.timeoutInMs
    );
  }

  addListener(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  addListener(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  addListener(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  on(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  on(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  on(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  once(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  once(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  once(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  prependListener(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  prependListener(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  prependListener(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  prependOnceListener(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  prependOnceListener(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(event, listener);
  }

  start() {
    if (this.recording) {
      return;
    }
    this.recognition?.start();
    this.recording = true;
    this.emit(SpeechRecognizerEvent.Start);
  }

  stop() {
    if (!this.recording) {
      return;
    }
    this.emit(SpeechRecognizerEvent.Stop);
    this.recognition?.stop();
  }

  abort() {
    if (!this.recording) {
      return;
    }
    this.emit(SpeechRecognizerEvent.Abort);
    this.recognition?.abort();
  }

  private setupSpeechRecognition(recognition: SpeechRecognition) {
    recognition.lang = this.config.lang;
    recognition.continuous = this.config.continuous;
    recognition.interimResults = this.config.interimResults;
    recognition.maxAlternatives = this.config.maxAlternatives;

    recognition.onaudiostart = (event: Event) => {
      if (this.silenceDetectionEnabled) {
        this.scheduleSilenceDetectionTimeout();
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (this.silenceDetectionEnabled) {
        this.scheduleSilenceDetectionTimeout();
      }
      this.emit(SpeechRecognizerEvent.SpeechRecognized, event);
    };

    recognition.onerror = (err: Event) => {
      this.emit(SpeechRecognizerEvent.Error, err);
    };

    recognition.onend = (event: Event) => {
      this.recording = false;
      this.emit(SpeechRecognizerEvent.End);
      if (this.silenceDetectionTimeoutId) {
        clearTimeout(this.silenceDetectionTimeoutId);
      }
    };
  }

  private scheduleSilenceDetectionTimeout() {
    if (this.silenceDetectionTimeoutId) {
      clearTimeout(this.silenceDetectionTimeoutId);
    }
    this.silenceDetectionTimeoutId = (setTimeout(() => {
      if (this.silenceDetectionEnabled) {
        this.emit(SpeechRecognizerEvent.SilenceDetected);
        this.stop();
      }
    }, this.config.silenceDetection.timeoutInMs) as unknown) as number;
  }
}
