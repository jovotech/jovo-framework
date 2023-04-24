import _get = require('lodash.get');
import _set = require('lodash.set');
import { AlexaSkill } from '../core/AlexaSkill';
import { AlexaRequest } from '../core/AlexaRequest';
import { Alexa } from '../Alexa';
import { EnumAlexaRequestType } from '../core/alexa-enums';
import { Plugin } from 'jovo-core';
import { AlexaResponse } from '../core/AlexaResponse';

export class CanFulfillIntent implements Plugin {
  static VALID_VALUES: string[] = ['YES', 'NO', 'MAYBE'];

  constructor() {}

  install(alexa: Alexa) {
    alexa.middleware('$type')!.use(this.type.bind(this));
    alexa.middleware('$output')!.use(this.output.bind(this));

    /**
     * Sets negative can fulfill request values.
     * @public
     */
    AlexaSkill.prototype.cannotFulfillRequest = function () {
      this.canFulfillRequest('NO');
      return this;
    };

    /**
     * Sets possible can fulfill request values.
     * @public
     */
    AlexaSkill.prototype.mayFulfillRequest = function () {
      this.canFulfillRequest('MAYBE');
      return this;
    };

    /**
     * Sets can fulfill request values.
     * @public
     * @param {string} canFulfillRequest
     */
    AlexaSkill.prototype.canFulfillRequest = function (canFulfillRequest = 'YES') {
      if (!CanFulfillIntent.VALID_VALUES.includes(canFulfillRequest)) {
        throw new Error('canFulfill must be one the following values: YES | NO | MAYBE');
      }
      _set(this.$output, 'Alexa.CanFulfillRequest', canFulfillRequest);
      return this;
    };

    /**
     * Sets can fulfill request values.
     * @public
     * @param {string} slotName
     * @param {string} canUnderstandSlot
     * @param {string} canFulfillSlot
     */
    AlexaSkill.prototype.canFulfillSlot = function (
      slotName: string,
      canUnderstandSlot: string,
      canFulfillSlot: string,
    ) {
      if (!CanFulfillIntent.VALID_VALUES.includes(canUnderstandSlot)) {
        throw new Error('canUnderstand must be one the following values: YES | NO | MAYBE');
      }

      if (canFulfillSlot !== 'YES' && canFulfillSlot !== 'NO') {
        throw new Error('canFulfill must be one the following values: YES | NO');
      }
      _set(this.$output, `Alexa.CanFulfillSlot.${slotName}`, {
        canUnderstand: canUnderstandSlot,
        canFulfill: canFulfillSlot,
      });
      return this;
    };
  }
  uninstall(alexa: Alexa) {}
  type(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;
    if (_get(alexaRequest, 'request.type') === 'CanFulfillIntentRequest') {
      alexaSkill.$type = {
        type: EnumAlexaRequestType.CAN_FULFILL_INTENT,
      };
    }
  }

  async output(alexaSkill: AlexaSkill) {
    const output = alexaSkill.$output;
    if (!alexaSkill.$response) {
      alexaSkill.$response = new AlexaResponse();
    }
    const response = alexaSkill.$response as AlexaResponse;

    if (_get(output, 'Alexa.CanFulfillRequest')) {
      if (_get(response, 'response.shouldEndSession')) {
        delete response.response.shouldEndSession;
      }

      if (_get(alexaSkill.$response, 'sessionAttributes')) {
        delete response.sessionAttributes;
      }
      _set(
        alexaSkill.$response,
        'response.canFulfillIntent.canFulfill',
        _get(output, 'Alexa.CanFulfillRequest'),
      );
    }

    if (_get(output, 'Alexa.CanFulfillSlot')) {
      if (_get(alexaSkill.$response, 'response.shouldEndSession')) {
        delete response.response.shouldEndSession;
      }

      if (_get(alexaSkill.$response, 'sessionAttributes')) {
        delete response.sessionAttributes;
      }
      _set(
        alexaSkill.$response,
        'response.canFulfillIntent.slots',
        _get(output, 'Alexa.CanFulfillSlot'),
      );
    }
  }
}
