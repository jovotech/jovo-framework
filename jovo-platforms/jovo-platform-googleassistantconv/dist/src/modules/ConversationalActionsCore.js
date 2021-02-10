"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _set = require("lodash.set");
const _get = require("lodash.get");
const GoogleActionSpeechBuilder_1 = require("../core/GoogleActionSpeechBuilder");
const Interfaces_1 = require("../core/Interfaces");
const GoogleAction_1 = require("../core/GoogleAction");
class ConversationalActionsCore {
    install(googleAssistant) {
        googleAssistant.middleware('$init').use(this.init.bind(this));
        googleAssistant.middleware('$type').use(this.type.bind(this));
        googleAssistant.middleware('$nlu').use(this.nlu.bind(this));
        googleAssistant.middleware('$inputs').use(this.inputs.bind(this));
        googleAssistant.middleware('$session').use(this.session.bind(this));
        googleAssistant.middleware('$output').use(this.output.bind(this));
        GoogleAction_1.GoogleAction.prototype.addFirstSimple = function (firstSimple) {
            _set(this.$output, 'GoogleAssistant.firstSimple', firstSimple);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addLastSimple = function (lastSimple) {
            _set(this.$output, 'GoogleAssistant.lastSimple', lastSimple);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addCard = function (card) {
            _set(this.$output, 'GoogleAssistant.card', card);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addImage = function (image) {
            _set(this.$output, 'GoogleAssistant.image', image);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addBasicCard = function (basicCard) {
            return this.addCard(basicCard);
        };
        GoogleAction_1.GoogleAction.prototype.addImageCard = function (imageCard) {
            return this.addImage(imageCard);
        };
        GoogleAction_1.GoogleAction.prototype.addTable = function (table) {
            _set(this.$output, 'GoogleAssistant.table', table);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addList = function (list) {
            _set(this.$output, 'GoogleAssistant.list', list);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addCollection = function (collection) {
            _set(this.$output, 'GoogleAssistant.collection', collection);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addCollectionBrowse = function (collectionBrowse) {
            _set(this.$output, 'GoogleAssistant.collectionBrowse', collectionBrowse);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.addTypeOverrides = function (typeOverrides) {
            let currentTypeOverrides = _get(this.$output, 'GoogleAssistant.typeOverrides', []);
            currentTypeOverrides = currentTypeOverrides.concat(typeOverrides);
            _set(this.$output, 'GoogleAssistant.typeOverrides', currentTypeOverrides);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.setTypeOverrides = function (typeOverrides) {
            _set(this.$output, 'GoogleAssistant.typeOverrides', typeOverrides);
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.showBasicCard = function (basicCard) {
            return this.addCard(basicCard);
        };
    }
    async init(handleRequest) {
        const requestObject = handleRequest.host.$request;
        if (requestObject.user &&
            requestObject.session &&
            requestObject.handler &&
            requestObject.device) {
            handleRequest.jovo = new GoogleAction_1.GoogleAction(handleRequest.app, handleRequest.host, handleRequest);
        }
    }
    type(googleAction) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const request = googleAction.$request;
        const hasNotificationSlot = (intent) => {
            for (const [key, value] of Object.entries(intent.params)) {
                if (key.startsWith('NotificationsSlot_')) {
                    return (value.resolved['@type'] ===
                        'type.googleapis.com/google.actions.conversation.v3.PermissionValue');
                }
            }
            return false;
        };
        if (((_a = request.intent) === null || _a === void 0 ? void 0 : _a.name) === 'actions.intent.MAIN' &&
            !((_b = request.session) === null || _b === void 0 ? void 0 : _b.params._JOVO_SESSION_)) {
            googleAction.$type = {
                type: jovo_core_1.EnumRequestType.LAUNCH,
            };
        }
        else if (((_c = request.intent) === null || _c === void 0 ? void 0 : _c.name) === 'actions.intent.CANCEL') {
            googleAction.$type = {
                type: jovo_core_1.EnumRequestType.END,
            };
        }
        else if (((_d = request.intent) === null || _d === void 0 ? void 0 : _d.params.prompt_option) &&
            ((_e = request.scene) === null || _e === void 0 ? void 0 : _e.slotFillingStatus) === 'FINAL') {
            googleAction.$type = {
                type: jovo_core_1.EnumRequestType.ON_ELEMENT_SELECTED,
                subType: _get(request, 'intent.params.prompt_option.resolved'),
            };
        }
        else if ((_g = (_f = request.intent) === null || _f === void 0 ? void 0 : _f.params) === null || _g === void 0 ? void 0 : _g.AccountLinkingSlot) {
            googleAction.$type = {
                type: Interfaces_1.EnumGoogleAssistantRequestType.ON_SIGN_IN,
            };
        }
        else if (hasNotificationSlot(request.intent)) {
            googleAction.$type = {
                type: Interfaces_1.EnumGoogleAssistantRequestType.ON_PERMISSION,
            };
        }
        else if (((_h = request.intent) === null || _h === void 0 ? void 0 : _h.name) === '' ||
            (((_j = request.intent) === null || _j === void 0 ? void 0 : _j.name) === 'actions.intent.MAIN' &&
                googleAction.$config.handlers[Interfaces_1.EnumGoogleAssistantRequestType.ON_SCENE])) {
            googleAction.$type = {
                type: Interfaces_1.EnumGoogleAssistantRequestType.ON_SCENE,
            };
        }
        else if ((_k = request.intent) === null || _k === void 0 ? void 0 : _k.name) {
            googleAction.$type = {
                type: jovo_core_1.EnumRequestType.INTENT,
            };
        }
        const isElementSelectedType = googleAction.$type.type === jovo_core_1.EnumRequestType.ON_ELEMENT_SELECTED;
        if (((_l = request.intent) === null || _l === void 0 ? void 0 : _l.name) === 'actions.intent.NO_INPUT_1' && !isElementSelectedType) {
            if (googleAction.$config.handlers[Interfaces_1.EnumGoogleAssistantRequestType.ON_NOINPUT1]) {
                googleAction.$type = {
                    type: Interfaces_1.EnumGoogleAssistantRequestType.ON_NOINPUT1,
                };
            }
            else {
                const noinput1 = _get(request, 'session.params._JOVO_SESSION_.reprompts.NO_INPUT1');
                if (noinput1) {
                    googleAction.ask(noinput1, noinput1);
                    googleAction.$type = {
                        type: Interfaces_1.EnumGoogleAssistantRequestType.ON_NOINPUT1,
                    };
                }
                else {
                    googleAction.$type = {
                        type: jovo_core_1.EnumRequestType.END,
                    };
                }
                googleAction.$handleRequest.excludedMiddlewareNames = [
                    'platform.nlu',
                    'asr',
                    'platform.nlu',
                    'nlu',
                    'user.load',
                    'asr',
                    'handler',
                    'user.save',
                    'tts',
                ];
            }
        }
        if (((_m = request.intent) === null || _m === void 0 ? void 0 : _m.name) === 'actions.intent.NO_INPUT_2' && !isElementSelectedType) {
            if (googleAction.$config.handlers[Interfaces_1.EnumGoogleAssistantRequestType.ON_NOINPUT2]) {
                googleAction.$type = {
                    type: Interfaces_1.EnumGoogleAssistantRequestType.ON_NOINPUT2,
                };
            }
            else {
                const noinput2 = _get(request, 'session.params._JOVO_SESSION_.reprompts.NO_INPUT2');
                if (noinput2) {
                    googleAction.ask(noinput2, noinput2);
                    googleAction.$type = {
                        type: Interfaces_1.EnumGoogleAssistantRequestType.ON_NOINPUT2,
                    };
                }
                else {
                    googleAction.$type = {
                        type: jovo_core_1.EnumRequestType.END,
                    };
                }
                googleAction.$handleRequest.excludedMiddlewareNames = [
                    'platform.nlu',
                    'asr',
                    'platform.nlu',
                    'nlu',
                    'user.load',
                    'asr',
                    'handler',
                    'user.save',
                    'tts',
                ];
            }
        }
        if (((_o = request.intent) === null || _o === void 0 ? void 0 : _o.name) === 'actions.intent.NO_INPUT_FINAL' && !isElementSelectedType) {
            if (googleAction.$config.handlers[Interfaces_1.EnumGoogleAssistantRequestType.ON_NOINPUTFINAL]) {
                googleAction.$type = {
                    type: Interfaces_1.EnumGoogleAssistantRequestType.ON_NOINPUT2,
                };
            }
            else {
                const noinputfinal = _get(request, 'session.params._JOVO_SESSION_.reprompts.NO_INPUTFINAL');
                if (noinputfinal) {
                    googleAction.ask(noinputfinal, noinputfinal);
                    googleAction.$type = {
                        type: Interfaces_1.EnumGoogleAssistantRequestType.ON_NOINPUTFINAL,
                    };
                }
                else {
                    googleAction.$type = {
                        type: jovo_core_1.EnumRequestType.END,
                    };
                }
                googleAction.$handleRequest.excludedMiddlewareNames = [
                    'platform.nlu',
                    'asr',
                    'platform.nlu',
                    'nlu',
                    'user.load',
                    'asr',
                    'handler',
                    'user.save',
                    'tts',
                ];
            }
        }
    }
    async nlu(googleAction) {
        const request = googleAction.$request;
        if (request.getIntentName() &&
            googleAction.$type &&
            googleAction.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            googleAction.$nlu = {
                intent: {
                    name: request.getIntentName(),
                },
            };
        }
    }
    async inputs(googleAction) {
        const request = googleAction.$request;
        googleAction.$inputs = request.getInputs();
    }
    async session(googleAction) {
        var _a, _b;
        const request = googleAction.$request;
        googleAction.$session.$data = Object.assign({}, (_a = request.session) === null || _a === void 0 ? void 0 : _a.params);
        if (!((_b = googleAction.$session.$data._JOVO_SESSION_) === null || _b === void 0 ? void 0 : _b.new)) {
            googleAction.$conversationalSession = {
                createdAt: new Date().toISOString(),
                new: true,
            };
        }
        else {
            googleAction.$conversationalSession = Object.assign(Object.assign({}, googleAction.$session.$data._JOVO_SESSION_), { new: false });
            googleAction.$session.$data._JOVO_SESSION_.new = false;
        }
    }
    async output(googleAction) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        const output = googleAction.$output;
        const request = googleAction.$request;
        const response = googleAction.$response;
        const tell = ((_a = output === null || output === void 0 ? void 0 : output.GoogleAssistant) === null || _a === void 0 ? void 0 : _a.tell) || (output === null || output === void 0 ? void 0 : output.tell);
        if (tell) {
            _set(googleAction.$response, 'prompt.firstSimple.speech', GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder.toSSML(tell.speech));
            if (tell.speechText) {
                _set(googleAction.$response, 'prompt.firstSimple.text', tell.speechText);
            }
            _set(googleAction.$response, 'scene.next.name', 'actions.scene.END_CONVERSATION');
        }
        const ask = ((_b = output === null || output === void 0 ? void 0 : output.GoogleAssistant) === null || _b === void 0 ? void 0 : _b.ask) || (output === null || output === void 0 ? void 0 : output.ask);
        if (ask) {
            _set(googleAction.$response, 'prompt.firstSimple.speech', GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder.toSSML(ask.speech));
            if (ask.speechText) {
                _set(googleAction.$response, 'prompt.firstSimple.text', ask.speechText);
            }
            if (!googleAction.$conversationalSession.reprompts) {
                let input1, input2, final;
                if (Array.isArray(ask.reprompt) && ask.reprompt[0]) {
                    input1 = ask.reprompt[0];
                }
                else if (typeof ask.reprompt === 'string') {
                    input1 = ask.reprompt;
                }
                if (Array.isArray(ask.reprompt) && ask.reprompt[1]) {
                    input2 = ask.reprompt[1];
                }
                else if (typeof ask.reprompt === 'string') {
                    input2 = ask.reprompt;
                }
                if (Array.isArray(ask.reprompt) && ask.reprompt[2]) {
                    final = ask.reprompt[2];
                }
                else if (typeof ask.reprompt === 'string') {
                    final = ask.reprompt;
                }
                googleAction.$conversationalSession.reprompts = {
                    NO_INPUT1: input1 ? jovo_core_1.SpeechBuilder.toSSML(input1) : undefined,
                    NO_INPUT2: input2 ? jovo_core_1.SpeechBuilder.toSSML(input2) : undefined,
                    NO_INPUTFINAL: final ? jovo_core_1.SpeechBuilder.toSSML(final) : undefined,
                };
            }
        }
        if ((_c = output.GoogleAssistant) === null || _c === void 0 ? void 0 : _c.firstSimple) {
            _set(googleAction.$response, 'prompt.firstSimple', output.GoogleAssistant.firstSimple);
        }
        if ((_d = output.GoogleAssistant) === null || _d === void 0 ? void 0 : _d.lastSimple) {
            _set(googleAction.$response, 'prompt.lastSimple', output.GoogleAssistant.lastSimple);
        }
        if ((_e = output.card) === null || _e === void 0 ? void 0 : _e.SimpleCard) {
            _set(googleAction.$response, 'prompt.content.card', {
                title: (_f = output.card) === null || _f === void 0 ? void 0 : _f.SimpleCard.title,
                text: (_g = output.card) === null || _g === void 0 ? void 0 : _g.SimpleCard.content,
            });
        }
        if ((_h = output.card) === null || _h === void 0 ? void 0 : _h.ImageCard) {
            _set(googleAction.$response, 'prompt.content.card', {
                title: (_j = output.card) === null || _j === void 0 ? void 0 : _j.ImageCard.title,
                text: (_k = output.card) === null || _k === void 0 ? void 0 : _k.ImageCard.content,
                image: {
                    url: (_l = output.card) === null || _l === void 0 ? void 0 : _l.ImageCard.imageUrl,
                    alt: (_m = output.card) === null || _m === void 0 ? void 0 : _m.ImageCard.title,
                },
            });
        }
        const suggestions = (_o = output.GoogleAssistant) === null || _o === void 0 ? void 0 : _o.suggestions;
        const quickReplies = output.quickReplies;
        if ((suggestions === null || suggestions === void 0 ? void 0 : suggestions.length) || (quickReplies === null || quickReplies === void 0 ? void 0 : quickReplies.length)) {
            const newSuggestions = (suggestions === null || suggestions === void 0 ? void 0 : suggestions.length) ? suggestions
                : quickReplies.map((quickReply) => ({
                    title: typeof quickReply !== 'string' ? quickReply.value : quickReply,
                }));
            _set(googleAction.$response, 'prompt.suggestions', newSuggestions);
        }
        if ((_p = output.GoogleAssistant) === null || _p === void 0 ? void 0 : _p.card) {
            if (!output.GoogleAssistant.card.text) {
                jovo_core_1.Log.warn(`Missing required 'text' value in card object`);
            }
            _set(googleAction.$response, 'prompt.content.card', output.GoogleAssistant.card);
        }
        if ((_q = output.GoogleAssistant) === null || _q === void 0 ? void 0 : _q.image) {
            _set(googleAction.$response, 'prompt.content.image', output.GoogleAssistant.image);
        }
        if ((_r = output.GoogleAssistant) === null || _r === void 0 ? void 0 : _r.table) {
            _set(googleAction.$response, 'prompt.content.table', output.GoogleAssistant.table);
        }
        if ((_s = output.GoogleAssistant) === null || _s === void 0 ? void 0 : _s.list) {
            _set(googleAction.$response, 'prompt.content.list', output.GoogleAssistant.list);
        }
        if ((_t = output.GoogleAssistant) === null || _t === void 0 ? void 0 : _t.collection) {
            _set(googleAction.$response, 'prompt.content.collection', output.GoogleAssistant.collection);
        }
        if ((_u = output.GoogleAssistant) === null || _u === void 0 ? void 0 : _u.collectionBrowse) {
            _set(googleAction.$response, 'prompt.content.collectionBrowse', output.GoogleAssistant.collectionBrowse);
        }
        if ((_v = output.GoogleAssistant) === null || _v === void 0 ? void 0 : _v.prompt) {
            _set(googleAction.$response, 'prompt', output.GoogleAssistant.prompt);
        }
        if ((_w = output.GoogleAssistant) === null || _w === void 0 ? void 0 : _w.askPrompt) {
            _set(googleAction.$response, 'prompt', output.GoogleAssistant.askPrompt.prompt);
        }
        response.user = {
            params: Object.assign({}, googleAction.$user.$params),
        };
        if (!tell || _get(googleAction.$app.config, 'keepSessionDataOnSessionEnded')) {
            response.session = {
                id: (_x = request.session) === null || _x === void 0 ? void 0 : _x.id,
                params: Object.assign({ _JOVO_SESSION_: googleAction.$conversationalSession, _JOVO_STATE_: null }, googleAction.$session.$data),
            };
        }
        if ((_y = output.GoogleAssistant) === null || _y === void 0 ? void 0 : _y.typeOverrides) {
            _set(googleAction.$response, 'session.typeOverrides', (_z = output.GoogleAssistant) === null || _z === void 0 ? void 0 : _z.typeOverrides);
        }
        if ((_0 = output.GoogleAssistant) === null || _0 === void 0 ? void 0 : _0.nextScene) {
            _set(googleAction.$response, 'scene.next.name', output.GoogleAssistant.nextScene);
        }
        if ((_1 = output.GoogleAssistant) === null || _1 === void 0 ? void 0 : _1.expected) {
            _set(googleAction.$response, 'expected', output.GoogleAssistant.expected);
        }
    }
    uninstall(googleAssistant) { }
}
exports.ConversationalActionsCore = ConversationalActionsCore;
//# sourceMappingURL=ConversationalActionsCore.js.map