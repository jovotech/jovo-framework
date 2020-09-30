import { EventEmitter } from 'events';
import { Base64Converter, ErrorListener, VoidListener } from '..';

export enum AudioPlayerEvent {
  Play = 'play',
  Pause = 'pause',
  Resume = 'resume',
  Stop = 'stop',
  End = 'end',
  Error = 'error',
}

export type AudioPlayerPlayListener = (audioSrc: string) => void;
export type AudioPlayerVoidEvents =
  | AudioPlayerEvent.Resume
  | AudioPlayerEvent.End
  | AudioPlayerEvent.Pause
  | AudioPlayerEvent.Stop;

export class AudioPlayer extends EventEmitter {
  private $volume = 1.0;
  private audio: HTMLAudioElement | null = null;
  private isAudioPlaying: boolean = false;
  private initialized = false;

  get isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  get volume(): number {
    return this.$volume;
  }

  set volume(value: number) {
    this.$volume = value;
    if (this.audio) {
      this.audio.volume = value;
    }
  }

  addListener(event: AudioPlayerVoidEvents, listener: VoidListener): this;
  addListener(event: AudioPlayerEvent.Play, listener: AudioPlayerPlayListener): this;
  addListener(event: AudioPlayerEvent.Error, listener: ErrorListener): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  on(event: AudioPlayerVoidEvents, listener: VoidListener): this;
  on(event: AudioPlayerEvent.Play, listener: AudioPlayerPlayListener): this;
  on(event: AudioPlayerEvent.Error, listener: ErrorListener): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  once(event: AudioPlayerVoidEvents, listener: VoidListener): this;
  once(event: AudioPlayerEvent.Play, listener: AudioPlayerPlayListener): this;
  once(event: AudioPlayerEvent.Error, listener: ErrorListener): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  prependListener(event: AudioPlayerVoidEvents, listener: VoidListener): this;
  prependListener(event: AudioPlayerEvent.Play, listener: AudioPlayerPlayListener): this;
  prependListener(event: AudioPlayerEvent.Error, listener: ErrorListener): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(event: AudioPlayerVoidEvents, listener: VoidListener): this;
  prependOnceListener(event: AudioPlayerEvent.Play, listener: AudioPlayerPlayListener): this;
  prependOnceListener(event: AudioPlayerEvent.Error, listener: ErrorListener): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(event, listener);
  }

  /**
   * Initialize the AudioPlayer. This needs to be called synchronously in a click-event handler for Safari in order to properly work.
   */
  async initialize() {
    if (this.initialized) {
      return;
    }
    const audio = new Audio('');
    try {
      await audio.play();
      audio.pause();
    } catch (e) {} // tslint:disable-line:no-empty
    this.audio = audio;
    this.initialized = true;
  }

  resume() {
    this.checkForInitialization();
    if (this.audio && !this.audio.ended && this.audio.paused) {
      this.audio.play().then(() => {
        this.isAudioPlaying = true;
        this.emit(AudioPlayerEvent.Resume);
      });
    }
  }

  pause() {
    this.checkForInitialization();
    if (this.audio && !this.audio.paused && !this.audio.ended) {
      this.audio.pause();
      this.emit(AudioPlayerEvent.Pause);
    }
  }

  stop() {
    this.checkForInitialization();
    if (this.audio && !this.audio.ended) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.emit(AudioPlayerEvent.Stop);
    }
  }

  play(audioSource: string, contentType = 'audio/mpeg'): Promise<void> {
    this.checkForInitialization();
    return new Promise(async (resolve, reject) => {
      if (!this.audio) {
        throw new Error('The AudioRecorder was not initialized. Cannot play audio.');
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
        this.audio!.onerror = null;
        this.audio!.onpause = null;
        this.audio!.onended = null;
        return resolve();
      };

      this.audio.src = audioSource;
      await this.audio.play();
      this.isAudioPlaying = true;
      this.emit(AudioPlayerEvent.Play, audioSource);
    });
  }

  private checkForInitialization() {
    if (!this.initialized) {
      throw new Error(
        `The AudioPlayer has to be initialized by calling the 'initialize'-method before being able to use it.`,
      );
    }
  }
}
