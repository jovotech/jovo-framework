import { AudioPlayerEvents, Base64Converter, CoreComponent } from '..';
import { AudioPlayback } from './Interfaces';

export class AudioPlayer extends CoreComponent {
  readonly name = 'AudioPlayer';
  private $volume = 1.0;
  private activePlaybacks: AudioPlayback[] = [];
  private idCounter = 0;

  get isPlaying(): boolean {
    return this.activePlaybacks.some((playback) => {
      return !playback.audio.paused && !playback.audio.ended;
    });
  }

  get volume(): number {
    return this.$volume;
  }

  set volume(value: number) {
    this.$volume = value;
    for (let i = 0, len = this.activePlaybacks.length; i < len; i++) {
      this.activePlaybacks[i].audio.volume = value;
    }
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
      this.resumePlayback(this.activePlaybacks[index]);
    }
  }

  resumeAll() {
    for (let i = 0, len = this.activePlaybacks.length; i < len; i++) {
      this.resumePlayback(this.activePlaybacks[i]);
    }
  }

  pause(id: number) {
    const index = this.findPlaybackIndex(id);
    if (index >= 0) {
      this.pausePlayback(this.activePlaybacks[index]);
    }
  }

  pauseAll() {
    for (let i = 0, len = this.activePlaybacks.length; i < len; i++) {
      this.pausePlayback(this.activePlaybacks[i]);
    }
  }

  stop(id: number) {
    const index = this.findPlaybackIndex(id);
    if (index >= 0) {
      this.stopPlayback(this.activePlaybacks[index]);
    }
  }

  stopAll() {
    for (let i = 0, len = this.activePlaybacks.length; i < len; i++) {
      this.stopPlayback(this.activePlaybacks[i]);
    }
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
        const id = this.idCounter;

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
        this.$client.emit(AudioPlayerEvents.Play, id, audioSource);

        this.activePlaybacks.push({
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
      this.activePlaybacks.splice(index, 1);
    }
  }

  private findPlayback(id: number): AudioPlayback | undefined {
    return this.activePlaybacks.find((playback: AudioPlayback) => {
      return playback.id === id;
    });
  }

  private findPlaybackIndex(id: number): number {
    return this.activePlaybacks.findIndex((playback: AudioPlayback) => {
      return playback.id === id;
    });
  }
}
