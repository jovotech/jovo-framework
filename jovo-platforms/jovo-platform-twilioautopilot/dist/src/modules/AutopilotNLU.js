"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class AutopilotNLU {
    install(autopilot) {
        autopilot.middleware('$nlu').use(this.nlu.bind(this));
        autopilot.middleware('$inputs').use(this.inputs.bind(this));
    }
    uninstall(autopilot) { }
    async nlu(autopilotBot) {
        var _a;
        const autopilotRequest = autopilotBot.$request;
        if (((_a = autopilotBot.$type) === null || _a === void 0 ? void 0 : _a.type) === jovo_core_1.EnumRequestType.INTENT) {
            autopilotBot.$nlu = {
                intent: {
                    name: autopilotRequest.getIntentName(),
                },
            };
        }
    }
    async inputs(autopilotBot) {
        const autopilotRequest = autopilotBot.$request;
        autopilotBot.$inputs = autopilotRequest.getInputs();
    }
}
exports.AutopilotNLU = AutopilotNLU;
//# sourceMappingURL=AutopilotNLU.js.map