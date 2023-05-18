import _defaultsDeep from 'lodash.defaultsdeep';
import { DeepPartial, VoidListener } from '..';
import { EventListenerMap, TypedEventEmitter } from '../utilities/TypedEventEmitter';

export enum SpeechSynthesizerEvent {
  Speak = 'speak',
  Pause = 'pause',
  Resume = 'resume',
  Stop = 'stop',
  End = 'end',
  Error = 'error',
}

export interface SpeechSynthesizerEventListenerMap extends EventListenerMap {
  [SpeechSynthesizerEvent.Speak]: (utterance: SpeechSynthesisUtterance) => void;
  [SpeechSynthesizerEvent.Pause]: VoidListener;
  [SpeechSynthesizerEvent.Resume]: VoidListener;
  [SpeechSynthesizerEvent.Stop]: VoidListener;
  [SpeechSynthesizerEvent.End]: VoidListener;
}

export interface SpeechSynthesizerConfig {
  enabled: boolean;
  language: string;
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number; 
}

export class SpeechSynthesizer extends TypedEventEmitter<SpeechSynthesizerEventListenerMap> {
  static getDefaultConfig(): SpeechSynthesizerConfig {
    return {
      enabled: true,
      language: 'en',
    };
  }
  volume = 1.0;
  readonly config: SpeechSynthesizerConfig;
  private readonly synthesis: SpeechSynthesis | null;
  private isSpeakingUtterance = false;

  constructor(config?: DeepPartial<SpeechSynthesizerConfig>) {
    super();

    const defaultConfig = SpeechSynthesizer.getDefaultConfig();
    this.config = config ? _defaultsDeep(config, defaultConfig) : defaultConfig;

    this.synthesis = window.speechSynthesis || null;
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

  resume(): void {
    if (!this.config.enabled || !this.canResume || !this.synthesis) {
      return;
    }
    this.synthesis.resume();
    this.emit(SpeechSynthesizerEvent.Resume);
  }

  pause(): void {
    if (!this.config.enabled || !this.canPause || !this.synthesis) {
      return;
    }
    this.synthesis.pause();
    this.emit(SpeechSynthesizerEvent.Pause);
  }

  stop(): void {
    if (!this.config.enabled || !this.canStop || !this.synthesis) {
      return;
    }
    this.synthesis.cancel();
    this.emit(SpeechSynthesizerEvent.Stop);
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
        utterance.volume = this.volume;
      }
      if (this.config.language) {
        utterance.lang = this.config.language;
      }
      if (this.config.voice) {
        utterance.voice = this.config.voice;
      }
      if (this.config.rate) {
        utterance.rate = this.config.rate;
      }
      if (this.config.pitch) {
        utterance.pitch = this.config.pitch;
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

      this.synthesis.speak(utterance);
      this.isSpeakingUtterance = true;
      this.emit(SpeechSynthesizerEvent.Speak, utterance);
    });
  }
}
