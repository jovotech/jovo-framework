import { EventEmitter } from 'events';
import _defaultsDeep from 'lodash.defaultsdeep';
import { BrowserDetector, DeepPartial, ErrorListener, VoidListener } from '..';

// TODO maybe rename SpeechRecognized to Processing to have almost identical events as the AudioRecorder
export enum SpeechRecognizerEvent {
  Start = 'start',
  Stop = 'stop',
  Abort = 'abort',
  StartDetected = 'start-detected',
  SpeechRecognized = 'speech-recognized',
  SilenceDetected = 'silence-detected',
  Timeout = 'timeout',
  Error = 'error',
  End = 'end',
}

export type SpeechRecognizerEndListener = (event?: SpeechRecognitionEvent) => void;
export type SpeechRecognizerSpeechRecognizedListener = (event: SpeechRecognitionEvent) => void;
export type SpeechRecognizerVoidEvents =
  | SpeechRecognizerEvent.Start
  | SpeechRecognizerEvent.Abort
  | SpeechRecognizerEvent.StartDetected
  | SpeechRecognizerEvent.SilenceDetected
  | SpeechRecognizerEvent.Timeout
  | SpeechRecognizerEvent.Stop;

export interface SpeechRecognizerDetectionConfig {
  enabled: boolean;
  timeoutInMs: number;
}

export type SpeechRecognitionConfig = Pick<
  SpeechRecognition,
  'continuous' | 'interimResults' | 'lang' | 'maxAlternatives'
>;

export interface SpeechRecognizerConfig extends SpeechRecognitionConfig {
  startDetection: SpeechRecognizerDetectionConfig;
  silenceDetection: SpeechRecognizerDetectionConfig;
  grammars: SpeechGrammarList | null;
}

export class SpeechRecognizer extends EventEmitter {
  get isRecording(): boolean {
    return this.recording;
  }

  get isAvailable(): boolean {
    return !!this.recognition;
  }

  get startDetectionEnabled(): boolean {
    return !!(
      this.config.continuous &&
      this.config.interimResults &&
      this.config.startDetection.enabled &&
      this.config.startDetection.timeoutInMs
    );
  }

  get silenceDetectionEnabled(): boolean {
    return !!(
      this.config.continuous &&
      this.config.interimResults &&
      this.config.silenceDetection.enabled &&
      this.config.silenceDetection.timeoutInMs
    );
  }

  static isSupported(): boolean {
    return (
      !!(window.SpeechRecognition || window.webkitSpeechRecognition) && BrowserDetector.isChrome()
    );
  }

  static getDefaultConfig(): SpeechRecognizerConfig {
    window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    return {
      lang: 'en',
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      grammars: window.SpeechGrammarList ? new window.SpeechGrammarList() : null,
      silenceDetection: {
        enabled: true,
        timeoutInMs: 1500,
      },
      startDetection: {
        enabled: true,
        timeoutInMs: 3000,
      },
    };
  }

  readonly config: SpeechRecognizerConfig;
  private readonly recognition: SpeechRecognition | null = null;
  private recording = false;
  private lastRecognitionEvent: SpeechRecognitionEvent | null = null;
  private timeoutId?: number;
  private ignoreNextEnd = false;

  constructor(config?: DeepPartial<SpeechRecognizerConfig>) {
    super();
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const defaultConfig = SpeechRecognizer.getDefaultConfig();
    this.config = config ? _defaultsDeep(config, defaultConfig) : defaultConfig;

    if (SpeechRecognizer.isSupported()) {
      this.recognition = new window.SpeechRecognition();
      this.setupSpeechRecognition(this.recognition);
    }
  }

  addListener(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  addListener(event: SpeechRecognizerEvent.End, listener: SpeechRecognizerEndListener): this;
  addListener(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  addListener(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  addListener(event: string | symbol, listener: AnyListener): this {
    return super.addListener(event, listener);
  }

  on(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  on(event: SpeechRecognizerEvent.End, listener: SpeechRecognizerEndListener): this;
  on(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  on(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  on(event: string | symbol, listener: AnyListener): this {
    return super.on(event, listener);
  }

  once(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  once(event: SpeechRecognizerEvent.End, listener: SpeechRecognizerEndListener): this;
  once(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  once(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  once(event: string | symbol, listener: AnyListener): this {
    return super.once(event, listener);
  }

  prependListener(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  prependListener(event: SpeechRecognizerEvent.End, listener: SpeechRecognizerEndListener): this;
  prependListener(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  prependListener(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  prependListener(event: string | symbol, listener: AnyListener): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(
    event: SpeechRecognizerEvent.SpeechRecognized,
    listener: SpeechRecognizerSpeechRecognizedListener,
  ): this;
  prependOnceListener(
    event: SpeechRecognizerEvent.End,
    listener: SpeechRecognizerEndListener,
  ): this;
  prependOnceListener(event: SpeechRecognizerEvent.Error, listener: ErrorListener): this;
  prependOnceListener(event: SpeechRecognizerVoidEvents, listener: VoidListener): this;
  prependOnceListener(event: string | symbol, listener: AnyListener): this {
    return super.prependOnceListener(event, listener);
  }

  start() {
    if (this.recording || !this.isAvailable) {
      return;
    }
    this.lastRecognitionEvent = null;
    this.recognition?.start();
    this.recording = true;
    this.emit(SpeechRecognizerEvent.Start);
  }

  stop() {
    if (!this.recording || !this.isAvailable) {
      return;
    }
    this.emit(SpeechRecognizerEvent.Stop);
    this.recognition?.stop();
  }

  abort() {
    if (!this.recording || !this.isAvailable) {
      return;
    }
    this.emit(SpeechRecognizerEvent.Abort);
    this.ignoreNextEnd = true;
    this.recognition?.abort();
  }

  private setupSpeechRecognition(recognition: SpeechRecognition) {
    recognition.lang = this.config.lang;
    recognition.continuous = this.config.continuous;
    recognition.interimResults = this.config.interimResults;
    recognition.maxAlternatives = this.config.maxAlternatives;

    recognition.onaudiostart = (event: Event) => {
      if (this.startDetectionEnabled) {
        this.scheduleStartDetectionTimeout();
      }
    };

    recognition.onspeechstart = (event: Event) => {
      if (this.startDetectionEnabled && this.timeoutId) {
        this.emit(SpeechRecognizerEvent.StartDetected);
        clearTimeout(this.timeoutId);
      }
      if (this.silenceDetectionEnabled) {
        this.scheduleSilenceDetectionTimeout();
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.lastRecognitionEvent = event;
      if (this.silenceDetectionEnabled) {
        this.scheduleSilenceDetectionTimeout();
      }
      this.emit(SpeechRecognizerEvent.SpeechRecognized, event);
    };

    recognition.onerror = (err: any) => {
      if (err.error === 'aborted') {
        return;
      }
      this.emit(SpeechRecognizerEvent.Error, err);
    };

    recognition.onend = (event: Event) => {
      this.recording = false;
      this.clearTimeout();
      if (this.ignoreNextEnd) {
        this.ignoreNextEnd = false;
        return;
      }
      this.emit(SpeechRecognizerEvent.End, this.lastRecognitionEvent);
    };
  }

  private scheduleStartDetectionTimeout() {
    this.clearTimeout();
    this.timeoutId = (setTimeout(() => {
      if (this.startDetectionEnabled) {
        this.emit(SpeechRecognizerEvent.Timeout);
        this.abort();
      }
    }, this.config.silenceDetection.timeoutInMs) as unknown) as number;
  }

  private scheduleSilenceDetectionTimeout() {
    this.clearTimeout();
    this.timeoutId = (setTimeout(() => {
      if (this.silenceDetectionEnabled) {
        this.emit(SpeechRecognizerEvent.SilenceDetected);
        if (this.lastRecognitionEvent) {
          this.stop();
        } else {
          this.emit(SpeechRecognizerEvent.Timeout);
          this.abort();
        }
      }
    }, this.config.silenceDetection.timeoutInMs) as unknown) as number;
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
