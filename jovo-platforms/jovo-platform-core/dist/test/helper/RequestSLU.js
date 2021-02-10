"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
class RequestSLU {
    constructor() {
        this.config = {};
    }
    install(corePlatform) {
        corePlatform.middleware('$nlu').use(this.nlu.bind(this));
        corePlatform.middleware('$inputs').use(this.inputs.bind(this));
    }
    async nlu(corePlatformApp) {
        const assistantRequest = corePlatformApp.$request;
        let intentName = 'DefaultFallbackIntent';
        if (assistantRequest.getIntentName()) {
            intentName = assistantRequest.getIntentName();
        }
        else if (corePlatformApp.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            intentName = 'LAUNCH';
        }
        else if (corePlatformApp.$type.type === jovo_core_1.EnumRequestType.END) {
            intentName = 'END';
        }
        corePlatformApp.$nlu = {
            intent: {
                name: intentName,
            },
        };
    }
    async inputs(corePlatformApp) {
        const corePlatformRequest = corePlatformApp.$request;
        if (!corePlatformApp.$nlu && corePlatformApp.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            throw new jovo_core_1.JovoError('No nlu data to get inputs off was given.');
        }
        else if (corePlatformApp.$type.type === jovo_core_1.EnumRequestType.LAUNCH ||
            corePlatformApp.$type.type === jovo_core_1.EnumRequestType.END) {
            corePlatformApp.$inputs = {};
            return;
        }
        corePlatformApp.$inputs = _get(corePlatformRequest, `request.nlu.inputs`, {});
    }
}
exports.RequestSLU = RequestSLU;
//# sourceMappingURL=RequestSLU.js.map