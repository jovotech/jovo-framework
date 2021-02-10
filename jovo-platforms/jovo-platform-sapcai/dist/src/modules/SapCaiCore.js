"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const __1 = require("..");
const _get = require("lodash.get");
const _set = require("lodash.set");
class Config {
}
class SapCaiCore {
    constructor() {
        this.config = {
            enabled: true,
            useLaunch: true,
        };
    }
    install(cai) {
        this.config.useLaunch = cai.config.useLaunch;
        cai.middleware('$init').use(this.init.bind(this));
        cai.middleware('$request').use(this.request.bind(this));
        cai.middleware('$type').use(this.type.bind(this));
        cai.middleware('$session').use(this.session.bind(this));
        cai.middleware('$output').use(this.output.bind(this));
        cai.middleware('$response').use(this.response.bind(this));
    }
    uninstall(cai) { }
    async init(handleRequest) {
        const requestObject = handleRequest.host.getRequestObject();
        if (requestObject &&
            requestObject.nlp &&
            requestObject.conversation &&
            requestObject.conversation.id) {
            handleRequest.jovo = new __1.SapCaiSkill(handleRequest.app, handleRequest.host, handleRequest);
        }
    }
    async request(caiSkill) {
        if (!caiSkill.$host) {
            throw new Error(`Couldn't access host object`);
        }
        caiSkill.$request = __1.SapCaiRequest.fromJSON(caiSkill.$host.getRequestObject());
        caiSkill.$user = new __1.SapCaiUser(caiSkill);
    }
    async type(caiSkill) {
        const request = caiSkill.$request;
        const sessionAttributes = request.getSessionAttributes();
        let type = jovo_core_1.EnumRequestType.INTENT;
        if (this.config.useLaunch &&
            sessionAttributes &&
            (typeof sessionAttributes[__1.NEW_SESSION_KEY] === 'undefined' ||
                sessionAttributes[__1.NEW_SESSION_KEY] === true)) {
            type = jovo_core_1.EnumRequestType.LAUNCH;
        }
        caiSkill.$type = {
            type,
        };
    }
    async session(caiSkill) {
        const request = caiSkill.$request;
        const sessionData = JSON.parse(JSON.stringify(request.getSessionAttributes() || {}));
        caiSkill.$requestSessionAttributes = sessionData;
        if (!caiSkill.$session) {
            caiSkill.$session = { $data: {} };
        }
        caiSkill.$session.$data = sessionData;
    }
    output(caiSkill) {
        const output = caiSkill.$output;
        if (!caiSkill.$response) {
            caiSkill.$response = new __1.SapCaiResponse();
        }
        if (Object.keys(output).length === 0) {
            return;
        }
        const tell = _get(output, 'SapCai.tell') || _get(output, 'tell');
        if (tell) {
            _set(caiSkill.$response, 'replies', [
                {
                    type: 'text',
                    content: tell.speech,
                },
            ]);
        }
        const ask = _get(output, 'SapCai.ask') || _get(output, 'ask');
        if (ask) {
            _set(caiSkill.$response, 'replies', [
                {
                    type: 'text',
                    content: ask.speech,
                },
            ]);
        }
        if (caiSkill.$session && caiSkill.$session.$data) {
            _set(caiSkill.$response, 'conversation.memory', caiSkill.$session.$data);
        }
    }
    async response(caiSkill) {
        if (caiSkill.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            const response = caiSkill.$response || new __1.SapCaiResponse();
            const sessionAttributes = response.getSessionAttributes() || {};
            sessionAttributes[__1.NEW_SESSION_KEY] = false;
            response.setSessionAttributes(sessionAttributes);
        }
    }
}
exports.SapCaiCore = SapCaiCore;
//# sourceMappingURL=SapCaiCore.js.map