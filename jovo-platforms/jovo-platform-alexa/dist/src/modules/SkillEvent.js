"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const AlexaSkill_1 = require("../core/AlexaSkill");
const alexa_enums_1 = require("../core/alexa-enums");
class SkillEvent {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        AlexaSkill_1.AlexaSkill.prototype.getBody = function () {
            return _get(this.$request, 'request.body');
        };
        AlexaSkill_1.AlexaSkill.prototype.getSkillEventBody = function () {
            return _get(this.$request, 'request.body');
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        if (_get(alexaRequest, 'request.type').substring(0, 15) === 'AlexaSkillEvent') {
            alexaSkill.$type = {
                type: alexa_enums_1.EnumAlexaRequestType.ON_EVENT,
                subType: _get(alexaRequest, 'request.type'),
            };
        }
        if (_get(alexaRequest, 'request.type').substring(0, 9) === 'Reminders') {
            alexaSkill.$type = {
                type: alexa_enums_1.EnumAlexaRequestType.ON_REMINDER_EVENT,
                subType: _get(alexaRequest, 'request.type'),
            };
        }
    }
}
exports.SkillEvent = SkillEvent;
//# sourceMappingURL=SkillEvent.js.map