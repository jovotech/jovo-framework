import _get = require('lodash.get');
import _set = require('lodash.set');
import { AlexaSkill } from '../core/AlexaSkill';
import { AlexaRequest } from '../core/AlexaRequest';
import { Alexa } from '../Alexa';
import { EnumRequestType, Plugin } from 'jovo-core';
import { AlexaResponse } from '../index';

export interface ImageSource {
  url: string;
  size?: string;
  widthPixels?: number;
  heightPixels?: number;
}

export interface MetaData {
  title?: string;
  subtitle?: string;
  art?: {
    sources: ImageSource[];
  };
  backgroundImage?: {
    sources: ImageSource[];
  };
}

export interface AudioItem {
  stream: {
    token: string;
    url: string;
    offsetInMilliseconds: number;
    expectedPreviousToken?: string;
  };
  metadata?: MetaData;
}

export class AudioPlayer {
  static PLAYBEHAVIOR_REPLACE_ALL = 'REPLACE_ALL';
  static PLAYBEHAVIOR_ENQUEUE = 'ENQUEUE';
  static PLAYBEHAVIOR_REPLACE_ENQUEUED = 'REPLACE_ENQUEUED';

  token?: string;
  playerActivity?: string;
  offsetInMilliseconds: number;
  expectedPreviousToken?: string;
  metaData?: MetaData;

  alexaSkill: AlexaSkill;

  constructor(alexaSkill: AlexaSkill) {
    this.alexaSkill = alexaSkill;
    this.playerActivity = _get(alexaSkill.$request, 'context.AudioPlayer.playerActivity');
    this.offsetInMilliseconds = _get(
      alexaSkill.$request,
      'context.AudioPlayer.offsetInMilliseconds',
    );
    this.token =
      _get(alexaSkill.$request, 'context.AudioPlayer.token') ||
      _get(alexaSkill.$request, 'request.token');
  }

  /**
   * Play audio file
   * @param {string} url
   * @param {string} token
   * @param {'ENQUEUE'|'REPLACE_ALL'|'REPLACE_ENQUEUED'} playBehavior
   * @return {Jovo}
   */
  play(url: string, token: string, playBehavior = AudioPlayer.PLAYBEHAVIOR_REPLACE_ALL) {
    const audioItem: AudioItem = {
      stream: {
        url,
        token,
        offsetInMilliseconds: this.offsetInMilliseconds,
      },
    };
    if (this.expectedPreviousToken) {
      audioItem.stream.expectedPreviousToken = this.expectedPreviousToken;
    }

    if (this.metaData) {
      audioItem.metadata = this.metaData;
    }

    _set(
      this.alexaSkill.$output,
      'Alexa.AudioPlayer',
      new AudioPlayerPlayDirective(playBehavior, audioItem),
    );
    return this.alexaSkill;
  }

  /**
   * Stops audio stream immediately
   * @return {Jovo}
   */
  stop() {
    _set(this.alexaSkill.$output, 'Alexa.AudioPlayer', new AudioPlayerStopDirective());
    return this.alexaSkill;
  }

  /**
   * Clear que
   * @param {'CLEAR_ENQUEUED'|'CLEAR_ALL'} clearBehavior
   * @return {Jovo}
   */
  clearQueue(clearBehavior = AudioPlayerClearQueueDirective.CLEARBEHAVIOR_CLEAR_ALL) {
    _set(
      this.alexaSkill.$output,
      'Alexa.AudioPlayer',
      new AudioPlayerClearQueueDirective(clearBehavior),
    );
    return this.alexaSkill;
  }

  /**
   * Enqueues file
   * @param {string} url
   * @param {string} token
   * @return {Jovo}
   */
  enqueue(url: string, token: string) {
    return this.play(url, token, AudioPlayer.PLAYBEHAVIOR_ENQUEUE);
  }

  /**
   * Start file from beginning
   * @param {string} url
   * @param {string} token
   * @return {Jovo}
   */
  startOver(url: string, token: string) {
    return this.setOffsetInMilliseconds(0).play(url, token, AudioPlayer.PLAYBEHAVIOR_ENQUEUE);
  }

  /**
   * Return offsetInMilliseconds
   * @return {number}
   */
  getOffsetInMilliseconds() {
    return this.offsetInMilliseconds;
  }

  /**
   * Adds offset in ms to audio item
   * @param {number} offsetInMilliseconds
   * @return {AudioPlayerPlugin}
   */
  setOffsetInMilliseconds(offsetInMilliseconds: number) {
    this.offsetInMilliseconds = offsetInMilliseconds;
    return this;
  }

  /**
   * Adds expectedPreviousToken to audio item
   * @link https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-audioplayer-interface-reference#play // eslint-disable-line no-use-before-define
   * @param {string} expectedPreviousToken
   * @return {AudioPlayerPlugin}
   */
  setExpectedPreviousToken(expectedPreviousToken: string) {
    this.expectedPreviousToken = expectedPreviousToken;
    return this;
  }

  /**
   * Returns token
   * @return {string}
   */
  getToken() {
    return this.token;
  }

  /**
   * Sets the meta data for the track
   * @param {MetaData} metaData
   * @return {AudioPlayerPlugin}
   */
  setMetaData(metaData: MetaData) {
    this.metaData = metaData;
  }

  /**
   * Adds a track title to be displayed
   * @param {string} title
   * @return {AudioPlayerPlugin}
   */
  setTitle(title: string) {
    if (!this.metaData) {
      this.metaData = {};
    }
    _set(this.metaData, 'title', title);

    return this;
  }

  /**
   * Adds a track subtitle to be displayed
   * @param {string} subtitle
   * @return {AudioPlayerPlugin}
   */
  setSubtitle(subtitle: string) {
    if (!this.metaData) {
      this.metaData = {};
    }
    _set(this.metaData, 'subtitle', subtitle);
    return this;
  }

  /**
   * Adds a track image
   * @param {string} url
   * @return {AudioPlayerPlugin}
   */
  addArtwork(url: string) {
    if (!this.metaData) {
      this.metaData = {};
    }
    _set(this.metaData, 'art', {
      sources: [{ url }],
    });
    return this;
  }

  /**
   * Adds an image to be displayed behind the track information
   * @param {string} url
   * @return {AudioPlayerPlugin}
   */
  addBackgroundImage(url: string) {
    if (!this.metaData) {
      this.metaData = {};
    }
    _set(this.metaData, 'backgroundImage', {
      sources: [{ url }],
    });
    return this;
  }

  /**
   * Adds an image to be displayed behind the track information
   * @deprecated Please use addBackgroundImage instead
   * @param {string} url
   * @return {AudioPlayerPlugin}
   */
  addBackground(url: string) {
    if (!this.metaData) {
      this.metaData = {};
    }
    _set(this.metaData, 'backgroundImage', {
      sources: [{ url }],
    });
    return this;
  }
}

export class AudioPlayerPlugin implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$type')!.use(this.type.bind(this));
    alexa.middleware('$output')!.use(this.output.bind(this));

    AlexaSkill.prototype.$audioPlayer = undefined;

    AlexaSkill.prototype.audioPlayer = function () {
      return this.$audioPlayer;
    };
  }
  uninstall(alexa: Alexa) {}
  type(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;
    if (_get(alexaRequest, 'request.type').substring(0, 11) === 'AudioPlayer') {
      alexaSkill.$type = {
        type: EnumRequestType.AUDIOPLAYER,
        subType: 'AlexaSkill.' + _get(alexaRequest, 'request.type').substring(12),
      };
    }
    alexaSkill.$audioPlayer = new AudioPlayer(alexaSkill);
  }

  output(alexaSkill: AlexaSkill) {
    const output = alexaSkill.$output;

    if (!alexaSkill.$response) {
      alexaSkill.$response = new AlexaResponse();
    }

    if (alexaSkill.$request!.hasAudioInterface()) {
      if (_get(output, 'Alexa.AudioPlayer')) {
        const directives = _get(alexaSkill.$response, 'response.directives', []);
        directives.push(_get(output, 'Alexa.AudioPlayer'));
        _set(alexaSkill.$response, 'response.directives', directives);
      }
    }
  }
}

abstract class AudioPlayerDirective {
  type: string;

  constructor(type: string) {
    this.type = type;
  }
}

class AudioPlayerPlayDirective extends AudioPlayerDirective {
  playBehavior?: string;
  audioItem?: AudioItem;

  constructor(playBehavior?: string, audioItem?: AudioItem) {
    super('AudioPlayer.Play');
    this.playBehavior = playBehavior;
    this.audioItem = audioItem;
  }

  setPlayBehavior(playBehavior: string) {
    this.playBehavior = playBehavior;
  }

  setAudioItem(audioItem: AudioItem) {
    this.audioItem = audioItem;
  }
}

class AudioPlayerStopDirective extends AudioPlayerDirective {
  constructor() {
    super('AudioPlayer.Stop');
  }
}

class AudioPlayerClearQueueDirective extends AudioPlayerDirective {
  static CLEARBEHAVIOR_CLEAR_ALL = 'CLEAR_ALL';
  static CLEARBEHAVIOR_CLEAR_ENQUEUED = 'CLEAR_ENQUEUED';

  clearBehavior?: string;

  constructor(clearBehavior?: string) {
    super('AudioPlayer.ClearQueue');
    this.clearBehavior = clearBehavior;
  }

  setClearBehavior(clearBehavior: string) {
    this.clearBehavior = clearBehavior;
  }

  clearAll() {
    this.clearBehavior = AudioPlayerClearQueueDirective.CLEARBEHAVIOR_CLEAR_ALL;
    return this;
  }

  clearEnqueued() {
    this.clearBehavior = AudioPlayerClearQueueDirective.CLEARBEHAVIOR_CLEAR_ENQUEUED;
    return this;
  }
}
