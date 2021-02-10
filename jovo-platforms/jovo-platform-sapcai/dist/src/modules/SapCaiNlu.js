"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class SapCaiNlu {
    install(sapcai) {
        sapcai.middleware('$nlu').use(this.nlu.bind(this));
        sapcai.middleware('$inputs').use(this.inputs.bind(this));
    }
    uninstall(sapcai) { }
    async nlu(caiSkill) {
        const alexaRequest = caiSkill.$request;
        if (caiSkill.$type && caiSkill.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            caiSkill.$nlu = {
                intent: {
                    name: alexaRequest.getIntentName(),
                },
            };
        }
    }
    inputs(caiSkill) {
        const request = caiSkill.$request;
        caiSkill.$inputs = request.getInputs();
    }
}
exports.SapCaiNlu = SapCaiNlu;
//# sourceMappingURL=SapCaiNlu.js.map