"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class AlexaNlu {
    install(alexa) {
        alexa.middleware('$nlu').use(this.nlu.bind(this));
        alexa.middleware('$inputs').use(this.inputs.bind(this));
    }
    uninstall(alexa) { }
    async nlu(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        if (alexaSkill.$type && alexaSkill.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            alexaSkill.$nlu = {
                intent: {
                    name: alexaRequest.getIntentName(),
                },
            };
        }
    }
    inputs(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        alexaSkill.$inputs = alexaRequest.getInputs();
    }
}
exports.AlexaNlu = AlexaNlu;
//# sourceMappingURL=AlexaNlu.js.map