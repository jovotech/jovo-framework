import _defaultsDeep from 'lodash.defaultsdeep';
import { Base64Converter, DeepPartial, VoidListener } from '..';
import { NotInitializedError } from '../errors/NotInitializedError';
import { EventListenerMap, TypedEventEmitter } from '../utilities/TypedEventEmitter';

export enum AudioPlayerEvent {
  Play = 'play',
  Pause = 'pause',
  Resume = 'resume',
  Stop = 'stop',
  End = 'end',
  Error = 'error',
}

export interface AudioPlayerEventListenerMap extends EventListenerMap {
  [AudioPlayerEvent.Play]: (audioSource: string) => void;
  [AudioPlayerEvent.Resume]: VoidListener;
  [AudioPlayerEvent.End]: VoidListener;
  [AudioPlayerEvent.Pause]: VoidListener;
  [AudioPlayerEvent.Stop]: VoidListener;
}

export interface AudioPlayerConfig {
  enabled: boolean;
}

export class AudioPlayer extends TypedEventEmitter<AudioPlayerEventListenerMap> {
  static getDefaultConfig(): AudioPlayerConfig {
    return {
      enabled: true,
    };
  }

  readonly config: AudioPlayerConfig;
  private audioVolume = 1.0;
  private audio: HTMLAudioElement | null = null;
  private isAudioPlaying = false;
  private initialized = false;

  constructor(config?: DeepPartial<AudioPlayerConfig>) {
    super();

    const defaultConfig = AudioPlayer.getDefaultConfig();
    this.config = config ? _defaultsDeep(config, defaultConfig) : defaultConfig;
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  get isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  get canResume(): boolean {
    return !!this.audio && !this.audio.ended && this.audio.paused;
  }

  get canPause(): boolean {
    return !!this.audio && !this.audio.ended && !this.audio.paused;
  }

  get canStop(): boolean {
    return !!this.audio && !this.audio.ended;
  }

  get volume(): number {
    return this.audioVolume;
  }

  set volume(value: number) {
    this.audioVolume = value;
    if (this.audio) {
      this.audio.volume = value;
    }
  }

  // Has to be called synchronously within an user-interaction handler (click, touch) in order to work on Safari
  initialize(): void {
    if (this.initialized) {
      return;
    }
    // Initialize audio with empty src in order for Safari to be able to use this audio asynchronously
    const audio = new Audio('');
    // Attempt to play audio and no matter what immediately pause afterwards (also required by Safari)
    audio
      .play()
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then(() => {})
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
      .finally(() => {
        audio.pause();
      });
    this.audio = audio;
    this.initialized = true;
  }

  play(audioSource: string, contentType = 'audio/mpeg'): Promise<void> {
    if (!this.config.enabled) {
      return Promise.resolve();
    }
    this.checkForInitialization();
    return new Promise(async (resolve, reject) => {
      if (!this.audio) {
        return reject(new NotInitializedError('AudioPlayer'));
      }

      if (!audioSource.startsWith('https://')) {
        const blob = await Base64Converter.base64ToBlob(audioSource, contentType);
        audioSource = URL.createObjectURL(blob);
      }

      this.audio.onerror = (e) => {
        this.isAudioPlaying = false;
        this.emit(AudioPlayerEvent.Error, e);
        return reject(e);
      };

      this.audio.onpause = () => {
        this.isAudioPlaying = false;
        return resolve();
      };

      this.audio.onended = () => {
        this.isAudioPlaying = false;
        this.emit(AudioPlayerEvent.End);
        if (this.audio) {
          this.audio.onerror = null;
          this.audio.onpause = null;
          this.audio.onended = null;
        }
        return resolve();
      };

      this.audio.src = audioSource;
      await this.audio.play();
      this.isAudioPlaying = true;
      this.emit(AudioPlayerEvent.Play, audioSource);
    });
  }

  resume(): void {
    if (!this.config.enabled) {
      return;
    }
    this.checkForInitialization();
    if (!this.canResume || !this.audio) {
      return;
    }
    this.audio.play().then(() => {
      this.isAudioPlaying = true;
      this.emit(AudioPlayerEvent.Resume);
    });
  }

  pause(): void {
    if (!this.config.enabled) {
      return;
    }
    this.checkForInitialization();
    if (!this.canPause || !this.audio) {
      return;
    }
    this.audio.pause();
    this.emit(AudioPlayerEvent.Pause);
  }

  stop(): void {
    if (!this.config.enabled) {
      return;
    }
    this.checkForInitialization();
    if (!this.canStop || !this.audio) {
      return;
    }
    this.audio.pause();
    this.audio.currentTime = 0;
    this.emit(AudioPlayerEvent.Stop);
  }

  private checkForInitialization() {
    if (!this.initialized) {
      throw new NotInitializedError('AudioPlayer');
    }
  }
}
