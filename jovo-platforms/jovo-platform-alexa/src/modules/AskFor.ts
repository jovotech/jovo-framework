import _get = require('lodash.get');

import { AlexaSkill } from '../core/AlexaSkill';
import { AlexaRequest } from '../core/AlexaRequest';
import { EnumAlexaRequestType } from '../core/alexa-enums';
import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import { AlexaResponse } from '..';
import _set = require('lodash.set');

export class AskFor implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$type')!.use(this.type.bind(this));
    alexa.middleware('$output')!.use(this.output.bind(this));

    AlexaSkill.prototype.askForPermission = function (permissionScope: string, token?: string) {
      _set(this.$output, 'Alexa.AskForPermission', {
        type: 'Connections.SendRequest',
        name: 'AskFor',
        payload: {
          '@type': 'AskForPermissionsConsentRequest',
          '@version': '1',
          'permissionScope': permissionScope,
        },
        token: token || '',
      });
      return this;
    };
    AlexaSkill.prototype.askForReminders = function (token?: string) {
      return this.askForPermission('alexa::alerts:reminders:skill:readwrite', token);
    };

    AlexaSkill.prototype.askForTimers = function (token?: string) {
      return this.askForPermission('alexa::alerts:timers:skill:readwrite', token);
    };

    AlexaSkill.prototype.getPermissionStatus = function () {
      return _get(this.$request, 'request.payload.status');
    };

    AlexaSkill.prototype.hasPermissionAccepted = function () {
      return _get(this.$request, 'request.payload.status') === 'ACCEPTED';
    };

    AlexaSkill.prototype.hasPermissionDenied = function () {
      return _get(this.$request, 'request.payload.status') === 'DENIED';
    };

    AlexaSkill.prototype.hasPermissionNotAnswered = function () {
      return _get(this.$request, 'request.payload.status') === 'NOT_ANSWERED';
    };

    AlexaSkill.prototype.getPermissionIsCardThrown = function () {
      return _get(this.$request, 'request.payload.isCardThrown');
    };
  }
  uninstall(alexa: Alexa) {}
  type(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;

    const responseNames = ['AskFor'];

    if (
      _get(alexaRequest, 'request.type') === 'Connections.Response' &&
      responseNames.includes(_get(alexaRequest, 'request.name'))
    ) {
      alexaSkill.$type = {
        type: EnumAlexaRequestType.ON_PERMISSION,
      };
    }
  }

  output(alexaSkill: AlexaSkill) {
    const output = alexaSkill.$output;
    const response = alexaSkill.$response as AlexaResponse;

    if (output.Alexa && output.Alexa.AskForPermission) {
      const directives = _get(response, 'response.directives', []);
      directives.push(_get(output, 'Alexa.AskForPermission'));
      _set(response, 'response.directives', directives);

      if (typeof _get(response, 'response.shouldEndSession') !== 'undefined') {
        delete response.response.shouldEndSession;
      }
    }
  }
}
