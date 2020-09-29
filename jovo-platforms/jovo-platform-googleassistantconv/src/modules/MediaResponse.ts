import { EnumRequestType, Plugin } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { Media, MediaObject, OptionalMediaControls } from '../core/Interfaces';
import { ConversationalActionResponse } from '../core/ConversationalActionResponse';
import { ConversationalActionRequest } from '../core/ConversationalActionRequest';

export class MediaResponse {
  googleAction: GoogleAction;

  constructor(googleAction: GoogleAction) {
    this.googleAction = googleAction;
  }

  playAudio(
    mediaObjects: MediaObject | MediaObject[],
    startOffset = '0s',
    optionalMediaControls: OptionalMediaControls[] = ['PAUSED', 'STOPPED'],
  ) {
    const mObjects = Array.isArray(mediaObjects) ? mediaObjects : [mediaObjects];

    const media: Media = {
      mediaType: 'AUDIO',
      mediaObjects: mObjects,
      startOffset,
      optionalMediaControls,
    };

    if (!this.googleAction.$output.GoogleAssistant) {
      this.googleAction.$output.GoogleAssistant = {};
    }

    this.googleAction.$output.GoogleAssistant.media = media;
    return this.googleAction;
  }

  getProgress() {
    return (this.googleAction.$request as ConversationalActionRequest).context?.media.progress;
  }

  // tslint:disable-next-line
  play(url: string, name: string, options?: any): GoogleAction {
    return this.googleAction;
    // const mediaObject: MediaObject = {
    //   name,
    //   contentUrl: url,
    // };
    //
    // if (_get(options, 'description')) {
    //   mediaObject.description = _get(options, 'description');
    // }
    //
    // if (_get(options, 'largeImage')) {
    //   mediaObject.largeImage = _get(options, 'largeImage');
    // }
    //
    // if (_get(options, 'icon')) {
    //   mediaObject.icon = _get(options, 'icon');
    // }
    //
    // _set(this.googleAction.$output, 'GoogleAssistant.MediaResponse', mediaObject);
    // return this.googleAction;
  }
}

export class MediaResponsePlugin implements Plugin {
  install(googleAssistant: GoogleAssistant) {
    googleAssistant.middleware('$type')!.use(this.type.bind(this));
    googleAssistant.middleware('$output')!.use(this.output.bind(this));

    GoogleAction.prototype.$audioPlayer = undefined;
    GoogleAction.prototype.$mediaResponse = undefined;

    GoogleAction.prototype.audioPlayer = function () {
      return this.$mediaResponse;
    };

    GoogleAction.prototype.mediaResponse = function () {
      return this.$mediaResponse;
    };
  }

  type(googleAction: GoogleAction) {
    if (_get(googleAction.$request, 'intent.name', '').startsWith('actions.intent.MEDIA_STATUS')) {
      _set(googleAction.$type, 'type', EnumRequestType.AUDIOPLAYER);

      const status = (googleAction.$request as ConversationalActionRequest).intent!.params
        .MEDIA_STATUS.resolved;

      const toCapitalCase = (str: string) => {
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
      };
      _set(googleAction.$type, 'subType', `GoogleAction.${toCapitalCase(status)}`);
    }

    googleAction.$mediaResponse = new MediaResponse(googleAction);
    googleAction.$audioPlayer = googleAction.$mediaResponse;
  }

  output(googleAction: GoogleAction) {
    if (!googleAction.hasMediaResponseInterface()) {
      return;
    }

    const output = googleAction.$output;

    if (output.GoogleAssistant?.media) {
      _set(
        googleAction.$response as ConversationalActionResponse,
        'prompt.content.media',
        output.GoogleAssistant.media,
      );
    }
    // _set(googleAction.$response as ConversationalActionResponse, 'scene.next.name', 'Prompts');
    // if (!googleAction.$originalResponse) {
    //   googleAction.$originalResponse = new GoogleActionResponse();
    // }
    // const output = googleAction.$output;
    //
    // if (_get(output, 'GoogleAssistant.MediaResponse')) {
    //   const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
    //   richResponseItems.push({
    //     mediaResponse: {
    //       mediaType: 'AUDIO',
    //       mediaObjects: [_get(output, 'GoogleAssistant.MediaResponse')],
    //     },
    //   });
    //   _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
    // }
  }
  uninstall(googleAssistant: GoogleAssistant) {}
}
