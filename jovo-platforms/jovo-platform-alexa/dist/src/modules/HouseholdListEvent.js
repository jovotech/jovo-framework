"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const alexa_enums_1 = require("../core/alexa-enums");
class HouseholdListEvent {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        if (_get(alexaRequest, 'request.type').substring(0, 23) === 'AlexaHouseholdListEvent') {
            alexaSkill.$type = {
                type: alexa_enums_1.EnumAlexaRequestType.ON_EVENT,
                subType: _get(alexaRequest, 'request.type').substring(24),
            };
        }
    }
}
exports.HouseholdListEvent = HouseholdListEvent;
//# sourceMappingURL=HouseholdListEvent.js.map