import { Plugin } from 'jovo-core';
import { Bixby } from '../Bixby';
import { BixbyCapsule } from '..';
import { BixbyResponse } from '../core/BixbyResponse';
import _set from 'lodash.set';

export type RepeatMode = 'OFF' | 'ALL' | 'ONE';
// TODO what formats are possible
export type Format = '';

export interface Stream {
  url: string;
  format: string;
  token?: string;
  offsetInMilliseconds?: number;
}

export interface AudioInfo {
  id: string;
  stream?: Stream[];
  title: string;
  subtitle?: string;
  artist: string;
  albumArtUrl: string;
  duration?: number;
  albumName?: string;
}

export class BixbyAudioPlayerPlugin implements Plugin {
  install(bixby: Bixby) {
    bixby.middleware('$output')!.use(this.output.bind(this));
    BixbyCapsule.prototype.$audioPlayer = new BixbyAudioPlayer();
  }

  output(capsule: BixbyCapsule) {
    // TODO necessary?
    if (!capsule.$response) {
      capsule.$response = new BixbyResponse();
    }

    if (capsule.$audioPlayer && capsule.$audioPlayer.audioItem.stream) {
      _set(capsule.$response, '_JOVO_AUDIO_', capsule.$audioPlayer);
    }
  }
}

export class BixbyAudioPlayer {
  readonly category = 'MUSIC';
  audioItem: AudioInfo = {
    id: '',
    title: '',
    artist: '',
    albumArtUrl: '',
  };
  displayName = '';
  doNotWaitForTTS?: boolean;
  repeatMode?: RepeatMode;
  startAudioItemIndex?: number;

  setRepeatMode(repeatMode: RepeatMode) {
    this.repeatMode = repeatMode;
    return this;
  }

  setDisplayName(displayName: string) {
    this.displayName = displayName;
    return this;
  }

  waitForTTS(mode: boolean) {
    this.setDoNotWaitForTTS(!mode);
    return this;
  }

  setDoNotWaitForTTS(mode: boolean) {
    this.doNotWaitForTTS = mode;
    return this;
  }

  setStartAudioItemIndex(index: number) {
    this.startAudioItemIndex = index;
    return this;
  }

  play(item: Stream) {
    this.addAudioStream(item);
    return this;
  }

  enqueue(item: Stream) {
    this.addAudioStream(item);
    return this;
  }

  addAudioStream(item: Stream) {
    if (!this.audioItem.stream) {
      this.audioItem.stream = [];
    }
    this.audioItem.stream.push(item);
    return this;
  }

  addAudioStreams(items: Stream[]) {
    if (!this.audioItem.stream) {
      this.audioItem.stream = [];
    }
    this.audioItem.stream.push(...items);
    return this;
  }

  // -- Helper functions for AudioItem MetaData --
  setId(id: string) {
    this.audioItem.id = id;
    return this;
  }

  setTitle(title: string) {
    this.audioItem.title = title;
    return this;
  }

  setSubtitle(subtitle: string) {
    this.audioItem.subtitle = subtitle;
    return this;
  }

  setArtist(artist: string) {
    this.audioItem.artist = artist;
    return this;
  }

  setAlbumArt(url: string) {
    this.audioItem.albumArtUrl = url;
    return this;
  }

  setAlbumName(name: string) {
    this.audioItem.albumName = name;
    return this;
  }

  setDuration(duration: number) {
    this.audioItem.duration = duration;
    return this;
  }

  setMetaData(data: AudioInfo) {
    Object.assign(this.audioItem, data);
    return this;
  }
}
