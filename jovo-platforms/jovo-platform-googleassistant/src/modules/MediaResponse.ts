import { EnumRequestType, Plugin } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { GoogleActionResponse } from '..';
import { MediaObject } from '../core/Interfaces';

export class MediaResponse {
  googleAction: GoogleAction;

  constructor(googleAction: GoogleAction) {
    this.googleAction = googleAction;
  }

  // tslint:disable-next-line
  play(url: string, name: string, options?: any): GoogleAction {
    const mediaObject: MediaObject = {
      name,
      contentUrl: url,
    };

    if (_get(options, 'description')) {
      mediaObject.description = _get(options, 'description');
    }

    if (_get(options, 'largeImage')) {
      mediaObject.largeImage = _get(options, 'largeImage');
    }

    if (_get(options, 'icon')) {
      mediaObject.icon = _get(options, 'icon');
    }

    _set(this.googleAction.$output, 'GoogleAssistant.MediaResponse', mediaObject);
    return this.googleAction;
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
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.MEDIA_STATUS'
    ) {
      _set(googleAction.$type, 'type', EnumRequestType.AUDIOPLAYER);
      for (const argument of _get(
        googleAction.$originalRequest || googleAction.$request,
        'inputs[0]["arguments"]',
        [],
      )) {
        if (argument.name === 'MEDIA_STATUS') {
          let status = argument.extension.status.toLowerCase();
          status = status.charAt(0).toUpperCase() + status.slice(1);

          _set(googleAction.$type, 'subType', `GoogleAction.${status}`);
        }
      }
    }

    googleAction.$mediaResponse = new MediaResponse(googleAction);
    googleAction.$audioPlayer = googleAction.$mediaResponse;
  }

  output(googleAction: GoogleAction) {
    if (!googleAction.hasMediaResponseInterface()) {
      return;
    }
    if (!googleAction.$originalResponse) {
      googleAction.$originalResponse = new GoogleActionResponse();
    }
    const output = googleAction.$output;

    if (_get(output, 'GoogleAssistant.MediaResponse')) {
      const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
      richResponseItems.push({
        mediaResponse: {
          mediaType: 'AUDIO',
          mediaObjects: [_get(output, 'GoogleAssistant.MediaResponse')],
        },
      });
      _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
    }
  }
  uninstall(googleAssistant: GoogleAssistant) {}
}
