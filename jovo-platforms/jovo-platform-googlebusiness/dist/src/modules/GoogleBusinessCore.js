"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const GoogleBusinessBot_1 = require("../core/GoogleBusinessBot");
const GoogleBusinessRequest_1 = require("../core/GoogleBusinessRequest");
const GoogleBusinessResponse_1 = require("../core/GoogleBusinessResponse");
const GoogleBusinessUser_1 = require("../core/GoogleBusinessUser");
class GoogleBusinessCore {
    install(googleBusiness) {
        googleBusiness.middleware('$init').use(this.init.bind(this));
        googleBusiness.middleware('$request').use(this.request.bind(this));
        googleBusiness.middleware('$type').use(this.type.bind(this));
        googleBusiness.middleware('$output').use(this.output.bind(this));
    }
    async init(handleRequest) {
        const requestObject = handleRequest.host.getRequestObject();
        if (requestObject.agent &&
            requestObject.conversationId &&
            requestObject.customAgentId &&
            requestObject.requestId) {
            handleRequest.jovo = new GoogleBusinessBot_1.GoogleBusinessBot(handleRequest.app, handleRequest.host, handleRequest);
        }
    }
    async request(googleBusinessBot) {
        if (!googleBusinessBot.$host) {
            throw new jovo_core_1.JovoError(`Couldn't access $host object`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-platform-googlebusiness', 'The $host object is necessary to initialize both $request and $user');
        }
        googleBusinessBot.$request = GoogleBusinessRequest_1.GoogleBusinessRequest.fromJSON(googleBusinessBot.$host.getRequestObject());
        googleBusinessBot.$user = new GoogleBusinessUser_1.GoogleBusinessUser(googleBusinessBot);
    }
    async type(googleBusinessBot) {
        // Google Business Messages doesn't support other request types
        googleBusinessBot.$type = {
            type: jovo_core_1.EnumRequestType.INTENT,
        };
    }
    async output(googleBusinessBot) {
        const output = googleBusinessBot.$output;
        if (!googleBusinessBot.$response) {
            googleBusinessBot.$response = new GoogleBusinessResponse_1.GoogleBusinessResponse();
        }
        const response = googleBusinessBot.$response;
        if (!response.response) {
            response.response = googleBusinessBot.makeBaseResponse();
        }
        if (Object.keys(output).length === 0) {
            return;
        }
        const tell = output.tell;
        if (tell) {
            response.response.text = tell.speech;
        }
        const ask = output.ask;
        if (ask) {
            response.response.text = ask.speech;
        }
        const suggestions = output.GoogleBusiness.Suggestions;
        const quickReplies = output.quickReplies;
        if ((suggestions === null || suggestions === void 0 ? void 0 : suggestions.length) || (quickReplies === null || quickReplies === void 0 ? void 0 : quickReplies.length)) {
            const newSuggestions = (suggestions === null || suggestions === void 0 ? void 0 : suggestions.length) ? suggestions
                : quickReplies.map((quickReply) => ({
                    reply: {
                        postbackData: typeof quickReply === 'string' ? quickReply : quickReply.value,
                        text: typeof quickReply === 'string' ? quickReply : quickReply.label || quickReply.value,
                    },
                }));
            response.response.suggestions = newSuggestions;
        }
        const fallback = output.GoogleBusiness.Fallback;
        if (fallback) {
            response.response.fallback = fallback;
        }
    }
}
exports.GoogleBusinessCore = GoogleBusinessCore;
//# sourceMappingURL=GoogleBusinessCore.js.map