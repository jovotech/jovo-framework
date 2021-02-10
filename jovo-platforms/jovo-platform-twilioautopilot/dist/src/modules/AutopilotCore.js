"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const AutopilotBot_1 = require("../core/AutopilotBot");
const AutopilotRequest_1 = require("../core/AutopilotRequest");
const AutopilotUser_1 = require("../core/AutopilotUser");
class AutopilotCore {
    install(autopilot) {
        autopilot.middleware('$init').use(this.init.bind(this));
        autopilot.middleware('$request').use(this.request.bind(this));
        autopilot.middleware('$type').use(this.type.bind(this));
        autopilot.middleware('$session').use(this.session.bind(this));
        autopilot.middleware('$output').use(this.output.bind(this));
    }
    uninstall(autopilot) { }
    async init(handleRequest) {
        const requestObject = handleRequest.host.getRequestObject();
        if (requestObject.DialogueSid &&
            requestObject.AccountSid &&
            requestObject.AssistantSid &&
            requestObject.UserIdentifier) {
            handleRequest.jovo = new AutopilotBot_1.AutopilotBot(handleRequest.app, handleRequest.host, handleRequest);
        }
    }
    async request(autopilotBot) {
        if (!autopilotBot.$host) {
            throw new jovo_core_1.JovoError("Couldn't access $host object", jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-platform-twilioautopilot', 'The $host object is necessary to initialize both $request and $user');
        }
        autopilotBot.$request = AutopilotRequest_1.AutopilotRequest.fromJSON(autopilotBot.$host.getRequestObject());
        autopilotBot.$user = new AutopilotUser_1.AutopilotUser(autopilotBot);
    }
    async type(autopilotBot) {
        const autopilotRequest = autopilotBot.$request;
        if (autopilotRequest.getIntentName() === 'greeting') {
            // intent by default in every project that has "hello" etc. as utterance
            autopilotBot.$type = {
                type: jovo_core_1.EnumRequestType.LAUNCH,
            };
        }
        else if (autopilotRequest.getIntentName() === 'goodbye') {
            autopilotBot.$type = {
                type: jovo_core_1.EnumRequestType.END,
            };
        }
        else {
            autopilotBot.$type = {
                type: jovo_core_1.EnumRequestType.INTENT,
            };
        }
    }
    async session(autopilotBot) {
        const autopilotRequest = autopilotBot.$request;
        autopilotBot.$requestSessionAttributes = autopilotRequest.getSessionData();
        if (!autopilotBot.$session) {
            autopilotBot.$session = { $data: {} };
        }
        autopilotBot.$session.$data = autopilotRequest.getSessionData();
    }
    async output(autopilotBot) {
        const output = autopilotBot.$output;
        const response = autopilotBot.$response;
        if (Object.keys(output).length === 0) {
            return;
        }
        const tell = output.tell;
        if (tell) {
            const sayAction = {
                say: tell.speech,
            };
            response.actions.unshift(sayAction);
        }
        const ask = output.ask;
        if (ask) {
            const sayAction = {
                say: ask.speech,
            };
            const listenAction = {
                listen: true,
            };
            response.actions.unshift(sayAction, listenAction);
        }
        // save session attributes.
        const rememberAction = {
            remember: autopilotBot.$session.$data,
        };
        response.actions.unshift(rememberAction);
    }
}
exports.AutopilotCore = AutopilotCore;
//# sourceMappingURL=AutopilotCore.js.map