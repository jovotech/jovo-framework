import { AudioPlayerEvents, Base64Converter } from '..';
import { JovoWebClient } from '../JovoWebClient';
import { AudioPlayback } from './Interfaces';

export class AudioPlayer {
  private $volume: number = 1.0;
  private $activePlaybacks: AudioPlayback[] = [];
  private $idCounter: number = 0;

  constructor(private readonly $client: JovoWebClient) {}

  get isPlaying(): boolean {
    let isPlaying = false;
    this.$activePlaybacks.forEach((playback: AudioPlayback) => {
      if (!playback.audio.paused && !playback.audio.ended) {
        isPlaying = true;
      }
    });
    return isPlaying;
  }

  get volume(): number {
    return this.$volume;
  }

  set volume(value: number) {
    this.$volume = value;
    this.$activePlaybacks.forEach((playback: AudioPlayback) => {
      playback.audio.volume = value;
    });
  }

  play(audioSource: string): Promise<void> {
    if (audioSource.startsWith('https://')) {
      return this.setupAudioAndPlay(audioSource);
    } else {
      return this.playBase64Encoded(audioSource, 'audio/mpeg');
    }
  }

  resume(id: number) {
    const index = this.findPlaybackIndex(id);
    if (index >= 0) {
      this.resumePlayback(this.$activePlaybacks[index]);
    }
  }

  resumeAll() {
    this.$activePlaybacks.forEach((playback: AudioPlayback) => {
      this.resumePlayback(playback);
    });
  }

  pause(id: number) {
    const index = this.findPlaybackIndex(id);
    if (index >= 0) {
      this.pausePlayback(this.$activePlaybacks[index]);
    }
  }

  pauseAll() {
    this.$activePlaybacks.forEach((playback: AudioPlayback) => {
      this.pausePlayback(playback);
    });
  }

  stop(id: number) {
    const index = this.findPlaybackIndex(id);
    if (index >= 0) {
      this.stopPlayback(this.$activePlaybacks[index]);
    }
  }

  stopAll() {
    this.$activePlaybacks.forEach((playback: AudioPlayback) => {
      this.stopPlayback(playback);
    });
  }

  private playBase64Encoded(base64Audio: string, contentType: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const blob = await Base64Converter.base64ToBlob(base64Audio, contentType);
        const url = URL.createObjectURL(blob);
        resolve(await this.setupAudioAndPlay(url));
      } catch (e) {
        reject(e);
      }
    });
  }

  private setupAudioAndPlay(audioSource: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const audio: HTMLAudioElement = new Audio(audioSource);
        audio.volume = this.volume;
        const id = this.$idCounter;

        audio.onerror = (e) => {
          this.$client.emit(AudioPlayerEvents.Error, e);
          reject(e);
        };

        audio.onpause = () => {
          const playback = this.findPlayback(id);
          if (playback && playback.stopped) {
            this.removePlayback(id);
            resolve();
          }
        };

        audio.onended = () => {
          this.removePlayback(id);
          this.$client.emit(AudioPlayerEvents.End, id);
          resolve();
        };

        await audio.play();
        this.$client.emit(AudioPlayerEvents.Play, id);

        this.$activePlaybacks.push({
          audio,
          id,
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private resumePlayback(playback: AudioPlayback) {
    if (!playback.audio.ended && playback.audio.paused) {
      playback.audio.play().then(() => {
        this.$client.emit(AudioPlayerEvents.Resume, playback.id);
      });
    }
  }

  private pausePlayback(playback: AudioPlayback) {
    if (!playback.audio.paused && !playback.audio.ended) {
      playback.audio.pause();
      this.$client.emit(AudioPlayerEvents.Pause, playback.id);
    }
  }

  private stopPlayback(playback: AudioPlayback) {
    if (!playback.audio.paused && !playback.audio.ended) {
      playback.audio.pause();
      playback.audio.currentTime = 0;
      playback.stopped = true;
      this.$client.emit(AudioPlayerEvents.Stop, playback.id);
    }
  }

  private removePlayback(id: number) {
    const index = this.findPlaybackIndex(id);
    if (index >= 0) {
      this.$activePlaybacks.splice(index, 1);
    }
  }

  private findPlayback(id: number): AudioPlayback | undefined {
    return this.$activePlaybacks.find((playback: AudioPlayback) => {
      return playback.id === id;
    });
  }

  private findPlaybackIndex(id: number): number {
    return this.$activePlaybacks.findIndex((playback: AudioPlayback) => {
      return playback.id === id;
    });
  }
}
