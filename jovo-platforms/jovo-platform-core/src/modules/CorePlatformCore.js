"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jovo_core_1 = require("jovo-core");
var __1 = require("..");
var _get = require("lodash.get");
var _set = require("lodash.set");
var CorePlatformCore = /** @class */ (function () {
    function CorePlatformCore() {
    }
    CorePlatformCore.prototype.install = function (platform) {
        platform.middleware('$init').use(this.init.bind(this));
        platform.middleware('$request').use(this.request.bind(this));
        platform.middleware('$type').use(this.type.bind(this));
        platform.middleware('$session').use(this.session.bind(this));
        platform.middleware('$tts.before').use(this.beforeTTS.bind(this));
        platform.middleware('$output').use(this.output.bind(this));
    };
    CorePlatformCore.prototype.uninstall = function (assistant) { };
    CorePlatformCore.prototype.init = function (handleRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var requestObject;
            return __generator(this, function (_a) {
                console.log('[CorePlatformCore] ( $init )');
                requestObject = handleRequest.host.getRequestObject();
                if (requestObject && requestObject.request && requestObject.$version) {
                    handleRequest.jovo = new __1.CorePlatformApp(handleRequest.app, handleRequest.host, handleRequest);
                }
                return [2 /*return*/];
            });
        });
    };
    CorePlatformCore.prototype.request = function (corePlatformApp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('[CorePlatformCore] ( $request )');
                if (!corePlatformApp.$host) {
                    throw new Error("Could't access host object.");
                }
                corePlatformApp.$request = __1.CorePlatformRequest.fromJSON(corePlatformApp.$host.getRequestObject());
                corePlatformApp.$user = new __1.CorePlatformUser(corePlatformApp);
                return [2 /*return*/];
            });
        });
    };
    CorePlatformCore.prototype.type = function (corePlatformApp) {
        return __awaiter(this, void 0, void 0, function () {
            var request, type;
            return __generator(this, function (_a) {
                console.log('[CorePlatformCore] ( $type )');
                request = corePlatformApp.$request;
                type = jovo_core_1.EnumRequestType.INTENT;
                if (request.isLaunch) {
                    type = jovo_core_1.EnumRequestType.LAUNCH;
                }
                else if (request.isEnd) {
                    type = jovo_core_1.EnumRequestType.END;
                }
                corePlatformApp.$type = {
                    type: type,
                };
                return [2 /*return*/];
            });
        });
    };
    CorePlatformCore.prototype.session = function (corePlatformApp) {
        return __awaiter(this, void 0, void 0, function () {
            var request, sessionData;
            return __generator(this, function (_a) {
                console.log('[CorePlatformCore] ( $session )');
                request = corePlatformApp.$request;
                sessionData = JSON.parse(JSON.stringify(request.getSessionAttributes() || {}));
                corePlatformApp.$requestSessionAttributes = sessionData;
                if (!corePlatformApp.$session) {
                    corePlatformApp.$session = { $data: {} };
                }
                corePlatformApp.$session.$data = sessionData;
                return [2 /*return*/];
            });
        });
    };
    CorePlatformCore.prototype.beforeTTS = function (corePlatformApp) {
        var tell = _get(corePlatformApp.$output, 'tell');
        if (tell) {
            corePlatformApp.$output.text = {
                speech: jovo_core_1.SpeechBuilder.removeSSML(tell.speech.toString()),
                reprompt: '',
            };
        }
        var ask = _get(corePlatformApp.$output, 'ask');
        if (ask) {
            corePlatformApp.$output.text = {
                speech: jovo_core_1.SpeechBuilder.removeSSML(ask.speech.toString()),
                reprompt: jovo_core_1.SpeechBuilder.removeSSML(ask.reprompt.toString()),
            };
        }
    };
    CorePlatformCore.prototype.output = function (corePlatformApp) {
        console.log('[CorePlatformCore] ( $output )');
        var output = corePlatformApp.$output;
        if (!corePlatformApp.$response) {
            corePlatformApp.$response = new __1.CorePlatformResponse();
        }
        if (Object.keys(output).length === 0) {
            return;
        }
        var tell = _get(output, 'tell');
        if (tell) {
            var tellObj = {
                speech: {
                    ssml: jovo_core_1.SpeechBuilder.toSSML(tell.speech.toString()),
                    text: _get(output, 'text.speech', ''),
                },
            };
            _set(corePlatformApp.$response, 'response.shouldEndSession', true);
            _set(corePlatformApp.$response, 'response.output', tellObj);
        }
        var ask = _get(output, 'ask');
        if (ask) {
            var askObj = {
                speech: {
                    ssml: jovo_core_1.SpeechBuilder.toSSML(ask.speech.toString()),
                    text: _get(output, 'text.speech', ''),
                },
            };
            if (ask.reprompt) {
                askObj.reprompt = {
                    ssml: jovo_core_1.SpeechBuilder.toSSML(ask.reprompt.toString()),
                    text: _get(output, 'text.reprompt', ''),
                };
            }
            _set(corePlatformApp.$response, 'response.shouldEndSession', false);
            _set(corePlatformApp.$response, 'response.output', askObj);
        }
        var actions = _get(output, 'actions');
        if (actions) {
            _set(corePlatformApp.$response, 'response.output.actions', actions);
        }
        if (corePlatformApp.getRawText()) {
            _set(corePlatformApp.$response, 'response.inputText', corePlatformApp.getRawText());
        }
        if (_get(corePlatformApp.$response, 'response.shouldEndSession') === false ||
            corePlatformApp.$app.config.keepSessionDataOnSessionEnded) {
            // set sessionAttributes
            if (corePlatformApp.$session && corePlatformApp.$session.$data) {
                _set(corePlatformApp.$response, 'sessionData', corePlatformApp.$session.$data);
            }
        }
    };
    return CorePlatformCore;
}());
exports.CorePlatformCore = CorePlatformCore;
