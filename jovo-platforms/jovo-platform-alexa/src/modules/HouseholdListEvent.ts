import _get = require('lodash.get');

import { AlexaSkill } from '../core/AlexaSkill';
import { AlexaRequest } from '../core/AlexaRequest';
import { EnumAlexaRequestType } from '../core/alexa-enums';
import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';

export class HouseholdListEvent implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$type')!.use(this.type.bind(this));
  }
  uninstall(alexa: Alexa) {}
  type(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;
    if (_get(alexaRequest, 'request.type').substring(0, 23) === 'AlexaHouseholdListEvent') {
      alexaSkill.$type = {
        type: EnumAlexaRequestType.ON_EVENT,
        subType: _get(alexaRequest, 'request.type').substring(24),
      };
    }
  }
}
