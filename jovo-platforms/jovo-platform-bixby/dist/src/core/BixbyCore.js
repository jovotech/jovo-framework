"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const lodash_get_1 = __importDefault(require("lodash.get"));
const lodash_set_1 = __importDefault(require("lodash.set"));
const BixbyCapsule_1 = require("./BixbyCapsule");
const BixbyRequest_1 = require("./BixbyRequest");
const BixbyUser_1 = require("../modules/BixbyUser");
const BixbyResponse_1 = require("./BixbyResponse");
class BixbyCore {
    install(bixby) {
        bixby.middleware('$init').use(this.init);
        bixby.middleware('$request').use(this.request);
        bixby.middleware('$type').use(this.type);
        bixby.middleware('$session').use(this.session);
        bixby.middleware('$output').use(this.output);
        bixby.middleware('$response').use(this.response);
    }
    init(handleRequest) {
        const { app, host } = handleRequest;
        const requestObject = host.getRequestObject();
        if (requestObject.$vivContext) {
            handleRequest.jovo = new BixbyCapsule_1.BixbyCapsule(app, host, handleRequest);
        }
    }
    request(capsule) {
        if (!capsule.$host) {
            throw new jovo_core_1.JovoError("Couldn't access host object.", jovo_core_1.ErrorCode.ERR, 'jovo-platform-bixby');
        }
        const requestObject = capsule.$host.getRequestObject();
        const requestQuery = capsule.$host.getQueryParams();
        capsule.$request = BixbyRequest_1.BixbyRequest.fromJSON(requestObject, requestQuery);
        capsule.$user = new BixbyUser_1.BixbyUser(capsule);
    }
    type(capsule) {
        const request = capsule.$request;
        const sessionData = request.getSessionAttributes();
        let type = jovo_core_1.EnumRequestType.INTENT;
        if (!sessionData || Object.keys(sessionData).length === 0) {
            type = jovo_core_1.EnumRequestType.LAUNCH;
        }
        capsule.$type = { type };
    }
    session(capsule) {
        const request = capsule.$request;
        const sessionData = Object.assign({}, request.getSessionAttributes());
        capsule.$requestSessionAttributes = sessionData;
        if (!capsule.$session) {
            capsule.$session = { $data: {} };
        }
        capsule.$session.$data = sessionData;
    }
    output(capsule) {
        const output = capsule.$output;
        if (!capsule.$response) {
            capsule.$response = new BixbyResponse_1.BixbyResponse();
        }
        if (Object.keys(output).length === 0) {
            return;
        }
        const tell = lodash_get_1.default(output, 'Bixby.tell') || lodash_get_1.default(output, 'tell');
        if (tell) {
            const speech = tell.speech ? jovo_core_1.SpeechBuilder.toSSML(tell.speech) : '';
            lodash_set_1.default(capsule.$response, '_JOVO_SPEECH_', speech);
            const text = tell.speech ? jovo_core_1.SpeechBuilder.removeSSML(tell.speech) : '';
            lodash_set_1.default(capsule.$response, '_JOVO_TEXT_', text);
        }
        const ask = lodash_get_1.default(output, 'Bixby.ask') || lodash_get_1.default(output, 'ask');
        if (ask) {
            const speech = ask.speech ? jovo_core_1.SpeechBuilder.toSSML(ask.speech) : '';
            lodash_set_1.default(capsule.$response, '_JOVO_SPEECH_', speech);
            const text = ask.speech ? jovo_core_1.SpeechBuilder.removeSSML(ask.speech) : '';
            lodash_set_1.default(capsule.$response, '_JOVO_TEXT_', text);
        }
        if (capsule.$session && capsule.$session.$data) {
            lodash_set_1.default(capsule.$response, '_JOVO_SESSION_DATA_', capsule.$session.$data);
        }
        // set layout data
        if (capsule.$layout) {
            lodash_set_1.default(capsule.$response, '_JOVO_LAYOUT_', capsule.$layout);
        }
    }
    response(capsule) {
        const request = capsule.$request;
        const response = capsule.$response || new BixbyResponse_1.BixbyResponse();
        if (!response.getSessionId()) {
            response.setSessionId(request.getSessionId());
        }
    }
}
exports.BixbyCore = BixbyCore;
//# sourceMappingURL=BixbyCore.js.map