"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const __1 = require("..");
const _get = require("lodash.get");
const _set = require("lodash.set");
class CorePlatformCore {
    constructor() {
        // Bind before and set as variable in order to be able to properly remove the fns
        this.initFn = this.init.bind(this);
        this.requestFn = this.request.bind(this);
        this.typeFn = this.type.bind(this);
        this.sessionFn = this.session.bind(this);
        this.outputFn = this.output.bind(this);
    }
    install(platform) {
        platform.middleware('$init').use(this.initFn);
        platform.middleware('$request').use(this.requestFn);
        platform.middleware('$type').use(this.typeFn);
        platform.middleware('$session').use(this.sessionFn);
        platform.middleware('$output').use(this.outputFn);
    }
    uninstall(platform) {
        (platform === null || platform === void 0 ? void 0 : platform.middleware('$init')).remove(this.initFn);
        (platform === null || platform === void 0 ? void 0 : platform.middleware('$request')).remove(this.requestFn);
        (platform === null || platform === void 0 ? void 0 : platform.middleware('$type')).remove(this.typeFn);
        (platform === null || platform === void 0 ? void 0 : platform.middleware('$session')).remove(this.sessionFn);
        (platform === null || platform === void 0 ? void 0 : platform.middleware('$output')).remove(this.outputFn);
    }
    async init(handleRequest) {
        const requestObject = handleRequest.host.getRequestObject();
        if (this.isCoreRequest(requestObject) && requestObject.type === 'jovo-platform-core') {
            handleRequest.jovo = new __1.CorePlatformApp(handleRequest.app, handleRequest.host, handleRequest);
        }
    }
    async request(corePlatformApp) {
        if (!corePlatformApp.$host) {
            throw new Error(`Couldn't access host object.`);
        }
        this.overwriteRequestAudioData(corePlatformApp.$host);
        corePlatformApp.$request = __1.CorePlatformRequest.fromJSON(corePlatformApp.$host.getRequestObject());
        corePlatformApp.$user = new __1.CorePlatformUser(corePlatformApp);
    }
    async type(corePlatformApp) {
        const request = corePlatformApp.$request;
        const requestType = _get(request, 'request.type');
        let type = jovo_core_1.EnumRequestType.INTENT;
        if (requestType === __1.RequestType.Launch) {
            type = jovo_core_1.EnumRequestType.LAUNCH;
        }
        else if (requestType === __1.RequestType.End) {
            type = jovo_core_1.EnumRequestType.END;
        }
        corePlatformApp.$type = {
            type,
        };
    }
    async session(corePlatformApp) {
        const request = corePlatformApp.$request;
        const sessionData = request.getSessionAttributes() || {};
        corePlatformApp.$requestSessionAttributes = sessionData;
        if (!corePlatformApp.$session) {
            corePlatformApp.$session = { $data: {} };
        }
        corePlatformApp.$session.$data = sessionData;
    }
    output(corePlatformApp) {
        var _a, _b, _c, _d;
        const output = corePlatformApp.$output;
        if (!corePlatformApp.$response) {
            corePlatformApp.$response = new __1.CorePlatformResponse();
        }
        if (Object.keys(output).length === 0) {
            return;
        }
        const coreResponse = corePlatformApp.$response;
        if (corePlatformApp.$asr.text) {
            coreResponse.context.request.asr = { text: corePlatformApp.$asr.text };
        }
        if ((corePlatformApp.$nlu.intent || corePlatformApp.$nlu.inputs) &&
            !coreResponse.context.request.nlu) {
            coreResponse.context.request.nlu = {};
        }
        if (corePlatformApp.$nlu.intent) {
            coreResponse.context.request.nlu.intent = corePlatformApp.$nlu.intent;
        }
        if (corePlatformApp.$nlu.inputs) {
            coreResponse.context.request.nlu.inputs = corePlatformApp.$nlu.inputs;
        }
        const platformType = this.getPlatformType();
        const defaultOutputAction = ((_b = (_a = corePlatformApp.$config.plugin) === null || _a === void 0 ? void 0 : _a[platformType]) === null || _b === void 0 ? void 0 : _b.defaultOutputAction) || __1.ActionType.Speech;
        const actionFromSpeech = (tellOrAsk) => {
            return defaultOutputAction === __1.ActionType.Speech
                ? {
                    displayText: tellOrAsk.speechText,
                    plain: jovo_core_1.SpeechBuilder.removeSSML(tellOrAsk.speech.toString()),
                    ssml: jovo_core_1.SpeechBuilder.toSSML(tellOrAsk.speech.toString()),
                    type: __1.ActionType.Speech,
                }
                : {
                    text: tellOrAsk.speechText || tellOrAsk.speech.toString(),
                    type: __1.ActionType.Text,
                };
        };
        const { tell, ask } = output;
        if (tell) {
            coreResponse.actions.push(actionFromSpeech(tell));
            coreResponse.session.end = true;
        }
        if (ask) {
            coreResponse.actions.push(actionFromSpeech(ask));
            if (defaultOutputAction === __1.ActionType.Speech) {
                const repromptAction = {
                    displayText: ask.repromptText,
                    plain: jovo_core_1.SpeechBuilder.removeSSML(ask.reprompt.toString()),
                    ssml: jovo_core_1.SpeechBuilder.toSSML(ask.reprompt.toString()),
                    type: __1.ActionType.Speech,
                };
                coreResponse.reprompts.push(repromptAction);
            }
        }
        const actions = (_c = output[platformType]) === null || _c === void 0 ? void 0 : _c.Actions;
        if (actions === null || actions === void 0 ? void 0 : actions.length) {
            coreResponse.actions.push(...actions);
        }
        const repromptActions = (_d = output[platformType]) === null || _d === void 0 ? void 0 : _d.RepromptActions;
        if (repromptActions === null || repromptActions === void 0 ? void 0 : repromptActions.length) {
            coreResponse.reprompts.push(...repromptActions);
        }
        if (!coreResponse.session.end || corePlatformApp.$config.keepSessionDataOnSessionEnded) {
            if (corePlatformApp.$session && corePlatformApp.$session.$data) {
                _set(corePlatformApp.$response, 'session.data', corePlatformApp.$session.$data);
            }
        }
    }
    getPlatformType() {
        return 'CorePlatform';
    }
    isCoreRequest(request) {
        var _a;
        return request.version && request.type && ((_a = request.request) === null || _a === void 0 ? void 0 : _a.type);
    }
    overwriteRequestAudioData(host) {
        var _a, _b, _c, _d;
        const audioBase64String = (_d = (_c = (_b = (_a = host.$request) === null || _a === void 0 ? void 0 : _a.request) === null || _b === void 0 ? void 0 : _b.body) === null || _c === void 0 ? void 0 : _c.audio) === null || _d === void 0 ? void 0 : _d.b64string;
        if (audioBase64String) {
            const samples = this.getSamplesFromAudio(audioBase64String);
            _set(host.$request, 'request.body.audio.data', samples);
        }
    }
    getSamplesFromAudio(base64) {
        const binaryBuffer = Buffer.from(base64, 'base64').toString('binary');
        const length = binaryBuffer.length / Float32Array.BYTES_PER_ELEMENT;
        const view = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
        const samples = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            const p = i * 4;
            view.setUint8(0, binaryBuffer.charCodeAt(p));
            view.setUint8(1, binaryBuffer.charCodeAt(p + 1));
            view.setUint8(2, binaryBuffer.charCodeAt(p + 2));
            view.setUint8(3, binaryBuffer.charCodeAt(p + 3));
            samples[i] = view.getFloat32(0, true);
        }
        return samples;
    }
}
exports.CorePlatformCore = CorePlatformCore;
//# sourceMappingURL=CorePlatformCore.js.map