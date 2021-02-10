"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const AlexaSkill_1 = require("../core/AlexaSkill");
const alexa_enums_1 = require("../core/alexa-enums");
const AlexaResponse_1 = require("../core/AlexaResponse");
class CanFulfillIntent {
    constructor() { }
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        alexa.middleware('$output').use(this.output.bind(this));
        /**
         * Sets negative can fulfill request values.
         * @public
         */
        AlexaSkill_1.AlexaSkill.prototype.cannotFulfillRequest = function () {
            this.canFulfillRequest('NO');
            return this;
        };
        /**
         * Sets possible can fulfill request values.
         * @public
         */
        AlexaSkill_1.AlexaSkill.prototype.mayFulfillRequest = function () {
            this.canFulfillRequest('MAYBE');
            return this;
        };
        /**
         * Sets can fulfill request values.
         * @public
         * @param {string} canFulfillRequest
         */
        AlexaSkill_1.AlexaSkill.prototype.canFulfillRequest = function (canFulfillRequest = 'YES') {
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
        AlexaSkill_1.AlexaSkill.prototype.canFulfillSlot = function (slotName, canUnderstandSlot, canFulfillSlot) {
            if (!CanFulfillIntent.VALID_VALUES.includes(canUnderstandSlot)) {
                throw new Error('canUnderstand must be one the following values: YES | NO | MAYBE');
            }
            if (canFulfillSlot !== 'YES' && canFulfillSlot !== 'NO') {
                throw new Error('canFulfill must be one the following values: YES | NO');
            }
            _set(this.$output, `Alexa.CanFulfillSlot.${slotName}`, {
                canUnderstandSlot,
                canFulfillSlot,
            });
            return this;
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        if (_get(alexaRequest, 'request.type') === 'CanFulfillIntentRequest') {
            alexaSkill.$type = {
                type: alexa_enums_1.EnumAlexaRequestType.CAN_FULFILL_INTENT,
            };
        }
    }
    async output(alexaSkill) {
        const output = alexaSkill.$output;
        if (!alexaSkill.$response) {
            alexaSkill.$response = new AlexaResponse_1.AlexaResponse();
        }
        const response = alexaSkill.$response;
        if (_get(output, 'Alexa.CanFulfillRequest')) {
            if (_get(response, 'response.shouldEndSession')) {
                delete response.response.shouldEndSession;
            }
            if (_get(alexaSkill.$response, 'sessionAttributes')) {
                delete response.sessionAttributes;
            }
            _set(alexaSkill.$response, 'response.canFulfillIntent.canFulfill', _get(output, 'Alexa.CanFulfillRequest'));
        }
        if (_get(output, 'Alexa.CanFulfillSlot')) {
            if (_get(alexaSkill.$response, 'response.shouldEndSession')) {
                delete response.response.shouldEndSession;
            }
            if (_get(alexaSkill.$response, 'sessionAttributes')) {
                delete response.sessionAttributes;
            }
            _set(alexaSkill.$response, 'response.canFulfillIntent.slots', _get(output, 'Alexa.CanFulfillSlot'));
        }
    }
}
exports.CanFulfillIntent = CanFulfillIntent;
CanFulfillIntent.VALID_VALUES = ['YES', 'NO', 'MAYBE'];
//# sourceMappingURL=CanFulfillIntent.js.map