"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class BixbyNLU {
    install(bixby) {
        bixby.middleware('$nlu').use(this.nlu.bind(this));
        bixby.middleware('$inputs').use(this.inputs.bind(this));
    }
    nlu(capsule) {
        const request = capsule.$request;
        if (capsule.$type && capsule.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            capsule.$nlu = {
                intent: {
                    name: request.getIntentName(),
                },
            };
        }
    }
    inputs(capsule) {
        const request = capsule.$request;
        capsule.$inputs = request.getInputs();
    }
}
exports.BixbyNLU = BixbyNLU;
//# sourceMappingURL=BixbyNLU.js.map