import { EventEmitter } from 'events';
import _defaultsDeep from 'lodash.defaultsdeep';
import { DeepPartial, ErrorListener, VoidListener } from '..';

export enum SpeechSynthesizerEvent {
  Speak = 'speak',
  Pause = 'pause',
  Resume = 'resume',
  Stop = 'stop',
  End = 'end',
  Error = 'error',
}

export type SpeechSynthesizerSpeakListener = (utterance: SpeechSynthesisUtterance) => void;
export type SpeechSynthesizerVoidEvents =
  | SpeechSynthesizerEvent.Pause
  | SpeechSynthesizerEvent.Resume
  | SpeechSynthesizerEvent.Stop
  | SpeechSynthesizerEvent.End;

export interface SpeechSynthesizerConfig {
  enabled: boolean;
  language: string;
  voice?: SpeechSynthesisVoice;
}

export class SpeechSynthesizer extends EventEmitter {
  get volume(): number {
    return this.$volume;
  }

  set volume(value: number) {
    this.$volume = value;
  }

  get isAvailable(): boolean {
    return !!this.synthesis;
  }

  get isSpeaking(): boolean {
    return this.isSpeakingUtterance;
  }

  get canPause(): boolean {
    return !!this.synthesis && this.synthesis.speaking && !this.synthesis.paused;
  }

  get canResume(): boolean {
    return !!this.synthesis && this.synthesis.speaking && this.synthesis.paused;
  }

  get canStop(): boolean {
    return !!this.synthesis && this.synthesis.speaking;
  }

  static getDefaultConfig(): SpeechSynthesizerConfig {
    return {
      enabled: true,
      language: 'en',
    };
  }
  readonly config: SpeechSynthesizerConfig;
  private $volume = 1.0;
  private readonly synthesis: SpeechSynthesis | null;
  private isSpeakingUtterance = false;

  constructor(config?: DeepPartial<SpeechSynthesizerConfig>) {
    super();

    const defaultConfig = SpeechSynthesizer.getDefaultConfig();
    this.config = config ? _defaultsDeep(config, defaultConfig) : defaultConfig;

    this.synthesis = window.speechSynthesis || null;
  }

  addListener(event: SpeechSynthesizerVoidEvents, listener: VoidListener): this;
  addListener(event: SpeechSynthesizerEvent.Speak, listener: SpeechSynthesizerSpeakListener): this;
  addListener(event: SpeechSynthesizerEvent.Error, listener: ErrorListener): this;
  addListener(event: string | symbol, listener: AnyListener): this {
    return super.addListener(event, listener);
  }

  on(event: SpeechSynthesizerVoidEvents, listener: VoidListener): this;
  on(event: SpeechSynthesizerEvent.Speak, listener: SpeechSynthesizerSpeakListener): this;
  on(event: SpeechSynthesizerEvent.Error, listener: ErrorListener): this;
  on(event: string | symbol, listener: AnyListener): this {
    return super.on(event, listener);
  }

  once(event: SpeechSynthesizerVoidEvents, listener: VoidListener): this;
  once(event: SpeechSynthesizerEvent.Speak, listener: SpeechSynthesizerSpeakListener): this;
  once(event: SpeechSynthesizerEvent.Error, listener: ErrorListener): this;
  once(event: string | symbol, listener: AnyListener): this {
    return super.once(event, listener);
  }

  prependListener(event: SpeechSynthesizerVoidEvents, listener: VoidListener): this;
  prependListener(
    event: SpeechSynthesizerEvent.Speak,
    listener: SpeechSynthesizerSpeakListener,
  ): this;
  prependListener(event: SpeechSynthesizerEvent.Error, listener: ErrorListener): this;
  prependListener(event: string | symbol, listener: AnyListener): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(event: SpeechSynthesizerVoidEvents, listener: VoidListener): this;
  prependOnceListener(
    event: SpeechSynthesizerEvent.Speak,
    listener: SpeechSynthesizerSpeakListener,
  ): this;
  prependOnceListener(event: SpeechSynthesizerEvent.Error, listener: ErrorListener): this;
  prependOnceListener(event: string | symbol, listener: AnyListener): this {
    return super.prependOnceListener(event, listener);
  }

  resume() {
    if (!this.config.enabled) {
      return;
    }
    if (this.canResume) {
      this.synthesis!.resume();
      this.emit(SpeechSynthesizerEvent.Resume);
    }
  }

  pause() {
    if (!this.config.enabled) {
      return;
    }
    if (this.canPause) {
      this.synthesis!.pause();
      this.emit(SpeechSynthesizerEvent.Pause);
    }
  }

  stop() {
    if (!this.config.enabled) {
      return;
    }
    if (this.canStop) {
      this.synthesis!.cancel();
      this.emit(SpeechSynthesizerEvent.Stop);
    }
  }

  speak(utterance: SpeechSynthesisUtterance | string, forceVolume = true): Promise<void> {
    if (!this.config.enabled) {
      return Promise.resolve();
    }
    return new Promise(async (resolve, reject) => {
      if (!this.synthesis) {
        return;
      }
      utterance =
        typeof utterance === 'string' ? new SpeechSynthesisUtterance(utterance) : utterance;

      if (forceVolume) {
        utterance.volume = this.$volume;
      }
      if (this.config.language) {
        utterance.lang = this.config.language;
      }
      if (this.config.voice) {
        utterance.voice = this.config.voice;
      }

      utterance.onerror = (e) => {
        this.isSpeakingUtterance = false;
        this.emit(SpeechSynthesizerEvent.Error, e);
        return reject(e);
      };

      utterance.onpause = () => {
        this.isSpeakingUtterance = false;
        return resolve();
      };

      utterance.onend = () => {
        this.isSpeakingUtterance = false;
        this.emit(SpeechSynthesizerEvent.End);
        return resolve();
      };

      this.synthesis?.speak(utterance);
      this.isSpeakingUtterance = true;
      this.emit(SpeechSynthesizerEvent.Speak, utterance);
    });
  }
}
