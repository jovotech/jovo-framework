import { Plugin } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { EnumGoogleAssistantRequestType } from '../core/google-assistant-enums';
import { GoogleActionResponse } from '..';

export class NewSurface implements Plugin {
  install(googleAssistant: GoogleAssistant) {
    googleAssistant.middleware('$type')!.use(this.type.bind(this));
    googleAssistant.middleware('$output')!.use(this.output.bind(this));

    GoogleAction.prototype.newSurface = function (
      capabilities: string[],
      context: string,
      notificationTitle: string,
    ) {
      this.$output.GoogleAssistant = {
        NewSurface: {
          capabilities,
          context,
          notificationTitle,
        },
      };
      return this;
    };

    GoogleAction.prototype.isNewSurfaceConfirmed = function () {
      for (const argument of _get(
        this.$originalRequest || this.$request,
        'inputs[0]["arguments"]',
        [],
      )) {
        if (argument.name === 'NEW_SURFACE') {
          return _get(argument, 'extension.status') === 'OK';
        }
      }
      return false;
    };
  }
  uninstall(googleAssistant: GoogleAssistant) {}
  type(googleAction: GoogleAction) {
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.NEW_SURFACE'
    ) {
      googleAction.$type.type = EnumGoogleAssistantRequestType.ON_NEW_SURFACE;
    }
  }
  output(googleAction: GoogleAction) {
    const output = googleAction.$output;
    if (!googleAction.$originalResponse) {
      googleAction.$originalResponse = new GoogleActionResponse();
    }

    if (_get(output, 'GoogleAssistant.NewSurface')) {
      const { capabilities, context, notificationTitle } = output.GoogleAssistant.NewSurface!;

      _set(googleAction.$originalResponse, 'expectUserResponse', true);

      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.NEW_SURFACE',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.v2.NewSurfaceValueSpec',
          context,
          capabilities,
          notificationTitle,
        },
      });
    }
  }
}
