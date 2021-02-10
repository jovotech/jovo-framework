"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class LindenbaumMockNlu {
    install(lindenbaum) {
        lindenbaum.middleware('$nlu').use(this.nlu.bind(this));
        lindenbaum.middleware('$inputs').use(this.inputs.bind(this));
    }
    uninstall(lindenbaum) { }
    async nlu(lindenbaumBot) {
        var _a;
        const request = lindenbaumBot.$request;
        if (((_a = lindenbaumBot.$type) === null || _a === void 0 ? void 0 : _a.type) === jovo_core_1.EnumRequestType.INTENT) {
            lindenbaumBot.$nlu = {
                intent: {
                    name: request.getIntentName(),
                },
            };
        }
    }
    async inputs(lindenbaumBot) {
        const request = lindenbaumBot.$request;
        lindenbaumBot.$inputs = request.getInputs();
    }
}
exports.LindenbaumMockNlu = LindenbaumMockNlu;
//# sourceMappingURL=LindenbaumMockNlu.js.map