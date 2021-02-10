"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _set = require("lodash.set");
const _get = require("lodash.get");
const _unionWith = require("lodash.unionwith");
const GoogleAction_1 = require("../core/GoogleAction");
const GoogleActionResponse_1 = require("../core/GoogleActionResponse");
const GoogleActionSpeechBuilder_1 = require("../core/GoogleActionSpeechBuilder");
const uuidv4 = require("uuid/v4");
const google_assistant_enums_1 = require("../core/google-assistant-enums");
class GoogleAssistantCore {
    install(googleAssistant) {
        googleAssistant.middleware('$init').use(this.init.bind(this));
        googleAssistant.middleware('$type').use(this.type.bind(this));
        googleAssistant.middleware('after.$type').use(this.userStorageGet.bind(this));
        googleAssistant.middleware('$output').use(this.output.bind(this));
        googleAssistant.middleware('after.$output').use(this.userStorageStore.bind(this));
        GoogleAction_1.GoogleAction.prototype.displayText = function (displayText) {
            _set(this.$output, 'GoogleAssistant.displayText', displayText);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.richResponse = function (richResponse) {
            _set(this.$output, 'GoogleAssistant.RichResponse', richResponse);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.appendResponse = function (responseItem) {
            if (this.$output.GoogleAssistant && this.$output.GoogleAssistant.ResponseAppender) {
                this.$output.GoogleAssistant.ResponseAppender.push(responseItem);
            }
            else {
                if (!this.$output.GoogleAssistant) {
                    this.$output.GoogleAssistant = {};
                }
                this.$output.GoogleAssistant.ResponseAppender = [responseItem];
            }
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.appendSimpleResponse = function (simpleResponse) {
            this.appendResponse({
                simpleResponse,
            });
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addSessionEntityTypes = function (sessionEntityTypes) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            if (!this.$output.GoogleAssistant.SessionEntityTypes) {
                this.$output.GoogleAssistant.SessionEntityTypes = [];
            }
            sessionEntityTypes.forEach((el) => {
                const sessionId = this.$request.getSessionId();
                const entityName = el.name;
                el.name = `${sessionId}/entityTypes/${entityName}`;
                if (!el.entityOverrideMode) {
                    el.entityOverrideMode = 'ENTITY_OVERRIDE_MODE_SUPPLEMENT';
                }
            });
            this.$output.GoogleAssistant.SessionEntityTypes = _unionWith(this.$output.GoogleAssistant.SessionEntityTypes, sessionEntityTypes, (newEntry, original) => {
                if (newEntry.name !== original.name) {
                    return false;
                }
                const entities = _unionWith(newEntry.entities, original.entities, (n, o) => {
                    if (n.value !== o.value) {
                        return false;
                    }
                    o.synonyms = _unionWith(o.synonyms, n.synonyms);
                    return true;
                });
                original.entities = entities;
                return true;
            });
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addSessionEntityType = function (sessionEntityType) {
            return this.addSessionEntityTypes([sessionEntityType]);
        };
        GoogleAction_1.GoogleAction.prototype.addSessionEntity = function (name, value, synonyms, entityOverrideMode) {
            const sessionEntityType = { name, entityOverrideMode, entities: [{ value, synonyms }] };
            return this.addSessionEntityType(sessionEntityType);
        };
    }
    async init(handleRequest) {
        const requestObject = handleRequest.host.$request;
        if (requestObject.user &&
            requestObject.conversation &&
            requestObject.surface &&
            requestObject.availableSurfaces) {
            handleRequest.jovo = new GoogleAction_1.GoogleAction(handleRequest.app, handleRequest.host, handleRequest);
        }
    }
    type(googleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.CANCEL') {
            _set(googleAction.$type, 'type', jovo_core_1.EnumRequestType.END);
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].arguments[0].name') === 'is_health_check' &&
            _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].arguments[0].boolValue') === true &&
            googleAction.$app.config.handlers.ON_HEALTH_CHECK) {
            _set(googleAction.$type, 'type', google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_HEALTH_CHECK);
            _set(googleAction.$type, 'optional', true);
        }
    }
    async output(googleAction) {
        const output = googleAction.$output;
        if (!googleAction.$originalResponse) {
            googleAction.$originalResponse = new GoogleActionResponse_1.GoogleActionResponse();
        }
        const tell = _get(output, 'GoogleAssistant.tell') || _get(output, 'tell');
        if (tell) {
            _set(googleAction.$originalResponse, 'expectUserResponse', false);
            _set(googleAction.$originalResponse, 'richResponse.items', [
                {
                    simpleResponse: {
                        ssml: GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder.toSSML(tell.speech),
                    },
                },
            ]);
        }
        const ask = _get(output, 'GoogleAssistant.ask') || _get(output, 'ask');
        if (ask) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'richResponse.items', [
                {
                    simpleResponse: {
                        ssml: GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder.toSSML(ask.speech),
                    },
                },
            ]);
            const noInputPrompts = [];
            if (output.ask && output.ask.reprompt && typeof output.ask.reprompt === 'string') {
                noInputPrompts.push({
                    ssml: GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder.toSSML(ask.reprompt),
                });
            }
            else if (Array.isArray(ask.reprompt)) {
                ask.reprompt.forEach((reprompt) => {
                    noInputPrompts.push({
                        ssml: GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder.toSSML(reprompt),
                    });
                });
            }
            _set(googleAction.$originalResponse, 'noInputPrompts', noInputPrompts);
        }
        if (_get(output, 'GoogleAssistant.displayText') && googleAction.hasScreenInterface()) {
            _set(googleAction.$originalResponse, 'richResponse.items[0].simpleResponse.displayText', _get(output, 'GoogleAssistant.displayText'));
        }
        if (output.GoogleAssistant && output.GoogleAssistant.RichResponse) {
            _set(googleAction.$originalResponse, 'richResponse', output.GoogleAssistant.RichResponse);
        }
        if (output.GoogleAssistant && output.GoogleAssistant.ResponseAppender) {
            let responseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
            responseItems = responseItems.concat(output.GoogleAssistant.ResponseAppender);
            _set(googleAction.$originalResponse, 'richResponse.items', responseItems);
        }
        if (output.GoogleAssistant && output.GoogleAssistant.SessionEntityTypes) {
            const responseItems = output.GoogleAssistant.SessionEntityTypes;
            _set(googleAction.$originalResponse, 'sessionEntityTypes', responseItems);
        }
    }
    async userStorageGet(googleAction) {
        try {
            googleAction.$user.$storage = JSON.parse(_get(googleAction.$originalRequest || googleAction.$request, 'user.userStorage'));
        }
        catch (e) { }
        const userId = googleAction.$user.$storage.userId || googleAction.$request.getUserId() || uuidv4();
        googleAction.$user.$storage.userId = userId;
    }
    async userStorageStore(googleAction) {
        const output = googleAction.$output;
        if (!googleAction.$originalResponse) {
            googleAction.$originalResponse = new GoogleActionResponse_1.GoogleActionResponse();
        }
        _set(googleAction.$originalResponse, 'userStorage', JSON.stringify(googleAction.$user.$storage));
    }
    uninstall(googleAssistant) { }
}
exports.GoogleAssistantCore = GoogleAssistantCore;
//# sourceMappingURL=GoogleAssistantCore.js.map