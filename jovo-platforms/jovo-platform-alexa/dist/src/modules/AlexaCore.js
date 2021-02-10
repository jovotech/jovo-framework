"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const jovo_core_1 = require("jovo-core");
const AlexaRequest_1 = require("../core/AlexaRequest");
const AlexaSkill_1 = require("../core/AlexaSkill");
const AlexaSpeechBuilder_1 = require("../core/AlexaSpeechBuilder");
const AlexaUser_1 = require("../core/AlexaUser");
const index_1 = require("../index");
class AlexaCore {
    install(alexa) {
        alexa.middleware('$init').use(this.init.bind(this));
        alexa.middleware('$request').use(this.request.bind(this));
        alexa.middleware('$type').use(this.type.bind(this));
        alexa.middleware('$session').use(this.session.bind(this));
        alexa.middleware('$output').use(this.output.bind(this));
    }
    uninstall(alexa) { }
    async init(handleRequest) {
        const requestObject = handleRequest.host.getRequestObject();
        if (requestObject.version && requestObject.request && requestObject.request.requestId) {
            handleRequest.jovo = new AlexaSkill_1.AlexaSkill(handleRequest.app, handleRequest.host, handleRequest);
        }
    }
    async request(alexaSkill) {
        if (!alexaSkill.$host) {
            throw new Error(`Couldn't access host object`);
        }
        alexaSkill.$request = AlexaRequest_1.AlexaRequest.fromJSON(alexaSkill.$host.getRequestObject());
        alexaSkill.$user = new AlexaUser_1.AlexaUser(alexaSkill);
    }
    async type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        if (_get(alexaRequest, 'request.type') === 'LaunchRequest') {
            alexaSkill.$type = {
                type: jovo_core_1.EnumRequestType.LAUNCH,
            };
        }
        if (_get(alexaRequest, 'request.type') === 'IntentRequest') {
            alexaSkill.$type = {
                type: jovo_core_1.EnumRequestType.INTENT,
            };
        }
        if (_get(alexaRequest, 'request.type') === 'SessionEndedRequest') {
            alexaSkill.$type = {
                type: jovo_core_1.EnumRequestType.END,
            };
            if (_get(alexaRequest, 'request.reason')) {
                alexaSkill.$type.subType = _get(alexaRequest, 'request.reason');
            }
        }
        if (_get(alexaRequest, 'request.type') === 'System.ExceptionEncountered') {
            alexaSkill.$type = {
                type: jovo_core_1.EnumRequestType.ON_ERROR,
            };
        }
    }
    async session(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        alexaSkill.$requestSessionAttributes = JSON.parse(JSON.stringify(alexaRequest.getSessionAttributes() || {}));
        if (!alexaSkill.$session) {
            alexaSkill.$session = { $data: {} };
        }
        alexaSkill.$session.$data = JSON.parse(JSON.stringify(alexaRequest.getSessionAttributes() || {}));
    }
    output(alexaSkill) {
        const output = alexaSkill.$output;
        if (!alexaSkill.$response) {
            alexaSkill.$response = new index_1.AlexaResponse();
        }
        if (Object.keys(output).length === 0) {
            return;
        }
        const tell = _get(output, 'Alexa.tell') || _get(output, 'tell');
        if (tell) {
            _set(alexaSkill.$response, 'response.shouldEndSession', true);
            _set(alexaSkill.$response, 'response.outputSpeech', {
                type: 'SSML',
                ssml: AlexaSpeechBuilder_1.AlexaSpeechBuilder.toSSML(tell.speech),
            });
        }
        const ask = _get(output, 'Alexa.ask') || _get(output, 'ask');
        if (ask) {
            _set(alexaSkill.$response, 'response.shouldEndSession', false);
            _set(alexaSkill.$response, 'response.outputSpeech', {
                type: 'SSML',
                ssml: AlexaSpeechBuilder_1.AlexaSpeechBuilder.toSSML(ask.speech),
            });
            _set(alexaSkill.$response, 'response.reprompt.outputSpeech', {
                type: 'SSML',
                ssml: AlexaSpeechBuilder_1.AlexaSpeechBuilder.toSSML(ask.reprompt),
            });
        }
        if (_get(alexaSkill.$response, 'response.shouldEndSession') === false) {
            // set sessionAttributes
            if (alexaSkill.$session && alexaSkill.$session.$data) {
                _set(alexaSkill.$response, 'sessionAttributes', alexaSkill.$session.$data);
            }
        }
        // add sessionData to response object explicitly
        if (_get(alexaSkill.$app.config, 'keepSessionDataOnSessionEnded')) {
            // set sessionAttributes
            if (alexaSkill.$session && alexaSkill.$session.$data) {
                _set(alexaSkill.$response, 'sessionAttributes', alexaSkill.$session.$data);
            }
        }
        if (_get(output, 'Alexa.Directives')) {
            _set(alexaSkill.$response, 'response.directives', _get(output, 'Alexa.Directives'));
        }
        if (_get(output, 'Alexa.deleteShouldEndSession')) {
            if (_get(alexaSkill.$response, 'response.shouldEndSession')) {
                delete alexaSkill.$response.response.shouldEndSession;
            }
        }
        if (typeof _get(output, 'Alexa.shouldEndSession') &&
            _get(output, 'Alexa.shouldEndSession') === null) {
            if (_get(alexaSkill.$response, 'response.shouldEndSession')) {
                delete alexaSkill.$response.response.shouldEndSession;
            }
        }
        if (typeof _get(output, 'Alexa.shouldEndSession') === 'boolean') {
            alexaSkill.$response.response.shouldEndSession = _get(output, 'Alexa.shouldEndSession');
        }
    }
}
exports.AlexaCore = AlexaCore;
//# sourceMappingURL=AlexaCore.js.map