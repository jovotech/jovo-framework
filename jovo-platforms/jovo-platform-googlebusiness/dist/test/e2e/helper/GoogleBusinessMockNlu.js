"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class GoogleBusinessMockNlu {
    install(googleBusiness) {
        googleBusiness.middleware('$nlu').use(this.nlu.bind(this));
        googleBusiness.middleware('$inputs').use(this.inputs.bind(this));
    }
    async nlu(googleBusinessBot) {
        var _a;
        const request = googleBusinessBot.$request;
        if (((_a = googleBusinessBot.$type) === null || _a === void 0 ? void 0 : _a.type) === jovo_core_1.EnumRequestType.INTENT) {
            googleBusinessBot.$nlu = {
                intent: {
                    name: request.getIntentName(),
                },
            };
        }
    }
    async inputs(googleBusinessBot) {
        const request = googleBusinessBot.$request;
        googleBusinessBot.$inputs = request.getInputs();
    }
}
exports.GoogleBusinessMockNlu = GoogleBusinessMockNlu;
//# sourceMappingURL=GoogleBusinessMockNlu.js.map