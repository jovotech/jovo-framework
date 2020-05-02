import _get = require('lodash.get');

import { AlexaSkill } from '../core/AlexaSkill';
import { AlexaRequest } from '../core/AlexaRequest';
import { EnumAlexaRequestType } from '../core/alexa-enums';
import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';

export interface EventSkillAccountLinkedBody {
  accessToken: string;
}

export interface EventSkillEnabledBody {}

export interface EventSkillDisabledBody {
  userInformationPersistenceStatus: 'PERSISTED' | 'NOT_PERSISTED';
}

export interface AcceptedPermission {
  scope: string;
}
export interface EventSkillPermissionAcceptedBody {
  acceptedPermissions: AcceptedPermission[];
}
export class SkillEvent implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$type')!.use(this.type.bind(this));
    AlexaSkill.prototype.getBody = function () {
      return _get(this.$request, 'request.body');
    };
    AlexaSkill.prototype.getSkillEventBody = function () {
      return _get(this.$request, 'request.body');
    };
  }
  uninstall(alexa: Alexa) {}
  type(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;
    if (_get(alexaRequest, 'request.type').substring(0, 15) === 'AlexaSkillEvent') {
      alexaSkill.$type = {
        type: EnumAlexaRequestType.ON_EVENT,
        subType: _get(alexaRequest, 'request.type'),
      };
    }

    if (_get(alexaRequest, 'request.type').substring(0, 9) === 'Reminders') {
      alexaSkill.$type = {
        type: EnumAlexaRequestType.ON_REMINDER_EVENT,
        subType: _get(alexaRequest, 'request.type'),
      };
    }
  }
}
