import _set from 'lodash.set';
import { Plugin, EnumRequestType } from 'jovo-core';
import { Bixby } from '../Bixby';
import { BixbyCapsule } from '..';
import { BixbyRequest } from '../core/BixbyRequest';
import { BixbyResponse } from '../core/BixbyResponse';

export type RepeatMode = 'OFF' | 'ALL' | 'ONE';
// TODO what formats are possible
export type Format = '';

export interface Stream {
  url: string;
  format?: string;
  token?: string;
  offsetInMilliseconds?: number;
}

export interface AudioInfo {
  id?: string;
  stream: Stream;
  title?: string;
  subtitle?: string;
  artist?: string;
  albumArtUrl?: string;
  duration?: number;
  albumName?: string;
}

export class BixbyAudioPlayerPlugin implements Plugin {
  install(bixby: Bixby) {
    bixby.middleware('$type')!.use(this.type.bind(this));
    bixby.middleware('$session')!.use(this.session.bind(this));
    bixby.middleware('$output')!.use(this.output.bind(this));

    BixbyCapsule.prototype.$audioPlayer = new BixbyAudioPlayer();
  }

  type(capsule: BixbyCapsule) {
    const request = capsule.$request as BixbyRequest;
    if (request.directive === 'AudioPlaying') {
      capsule.$type = {
        type: EnumRequestType.AUDIOPLAYER,
        subType: 'BixbyCapsule.AudioPlaying',
      };
    }
  }

  session(capsule: BixbyCapsule) {
    // Reset AudioPlayer on a new request.
    if (capsule.$type && capsule.$type.type === EnumRequestType.LAUNCH) {
      BixbyCapsule.prototype.$audioPlayer = new BixbyAudioPlayer();
    }
  }

  output(capsule: BixbyCapsule) {
    // TODO necessary?
    if (!capsule.$response) {
      capsule.$response = new BixbyResponse();
    }

    if (capsule.$audioPlayer && capsule.$audioPlayer.audioItem.length > 0) {
      _set(capsule.$response, '_JOVO_AUDIO_', capsule.$audioPlayer);
    }
  }
}

export class BixbyAudioPlayer {
  readonly category = 'MUSIC';
  audioItem: AudioInfo[] = [];
  displayName = 'Jovo AudioStream';
  doNotWaitForTTS = false;
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

  play(item: AudioInfo) {
    this.setAudioStream(item);
    return this;
  }

  enqueue(item: AudioInfo) {
    this.addAudioStream(item);
    return this;
  }

  addAudioStream(item: AudioInfo) {
    // Create default values for obligatory properties.
    if (!item.title) {
      item.title = 'AudioStream';
    }

    if (!item.artist) {
      item.artist = 'Bixby';
    }

    if (!item.id) {
      item.id = Date.now().toString();
    }

    if (!item.albumArtUrl) {
      item.albumArtUrl = 'https://test.jpg';
    }

    if (item.stream && !item.stream.format) {
      item.stream.format = 'audio/mp3';
    }

    this.audioItem.push(item);

    return this;
  }

  addAudioStreams(items: AudioInfo[]) {
    for (const item of items) {
      this.addAudioStream(item);
    }

    return this;
  }

  setAudioStream(item: AudioInfo) {
    this.audioItem = [];
    this.addAudioStream(item);

    return this;
  }
}
