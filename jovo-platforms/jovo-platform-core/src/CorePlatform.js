"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var _1 = require(".");
var _get = require("lodash.get");
var _merge = require("lodash.merge");
var _set = require("lodash.set");
var CorePlatform = /** @class */ (function (_super) {
    __extends(CorePlatform, _super);
    function CorePlatform(config) {
        var _this = _super.call(this, config) || this;
        _this.requestBuilder = new _1.CorePlatformRequestBuilder();
        _this.responseBuilder = new _1.CorePlatformResponseBuilder();
        _this.config = {
            enabled: true,
        };
        if (config) {
            _this.config = _merge(_this.config, config);
        }
        _this.actionSet = new jovo_core_1.ActionSet([
            '$init',
            '$request',
            '$session',
            '$user',
            '$type',
            '$asr',
            '$nlu',
            '$inputs',
            '$tts.before',
            '$tts',
            '$output',
            '$response',
        ], _this);
        return _this;
    }
    CorePlatform.prototype.getAppType = function () {
        return 'WebAssistantSkill';
    };
    CorePlatform.prototype.install = function (app) {
        app.$platform.set(this.constructor.name, this);
        app.middleware('request').use(this.request.bind(this));
        app.middleware('platform.init').use(this.initialize.bind(this));
        app.middleware('asr').use(this.asr.bind(this));
        app.middleware('nlu').use(this.nlu.bind(this));
        app.middleware('before.tts').use(this.beforeTTS.bind(this));
        app.middleware('tts').use(this.tts.bind(this));
        app.middleware('platform.output').use(this.output.bind(this));
        app.middleware('response').use(this.response.bind(this));
        // app.use(new InUserDb());
        this.use(new _1.WebAssistantCore(), new _1.Cards());
        jovo_core_1.Jovo.prototype.$webAssistantSkill = undefined;
        jovo_core_1.Jovo.prototype.webAssistantSkill = function () {
            if (this.constructor.name !== 'WebAssistantSkill') {
                throw Error("Can't handle request. Please use this.isWebAssistantSkill()");
            }
            return this;
        };
        jovo_core_1.Jovo.prototype.isWebAssistantSkill = function () {
            return this.constructor.name === 'WebAssistantSkill';
        };
        jovo_core_1.Jovo.prototype.action = function (key, value) {
            var actions = this.$output.actions || [];
            actions.push({ key: key, value: value });
            this.$output.actions = actions;
            return this;
        };
    };
    CorePlatform.prototype.request = function (handleRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var audioData;
            return __generator(this, function (_a) {
                console.log('--------------------------------------------------------------');
                console.log('[WebAssistant] { request } ');
                if (handleRequest.host.$request.audio) {
                    audioData = handleRequest.host.$request.audio.data;
                    // handleRequest.host.$request.audio.raw = audioData;
                    handleRequest.host.$request.audio.data = this.getSamplesFromAudio(audioData);
                }
                return [2 /*return*/];
            });
        });
    };
    CorePlatform.prototype.initialize = function (handleRequest) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('[WebAssistant] { platform.init }');
                        handleRequest.platformClazz = _1.CorePlatformApp;
                        return [4 /*yield*/, this.middleware('$init').run(handleRequest)];
                    case 1:
                        _a.sent();
                        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'WebAssistantSkill') {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        return [4 /*yield*/, this.middleware('$request').run(handleRequest.jovo)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.middleware('$type').run(handleRequest.jovo)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.middleware('$session').run(handleRequest.jovo)];
                    case 4:
                        _a.sent();
                        if (this.config.handlers) {
                            _set(handleRequest.app, 'config.handlers', _merge(_get(handleRequest.app, 'config.handlers'), this.config.handlers));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CorePlatform.prototype.asr = function (handleRequest) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'WebAssistantSkill') {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        console.log('[WebAssistant] { asr }');
                        return [4 /*yield*/, this.middleware('$asr').run(handleRequest.jovo)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CorePlatform.prototype.nlu = function (handleRequest) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'WebAssistantSkill') {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        console.log('[WebAssistant] { nlu }');
                        return [4 /*yield*/, this.middleware('$nlu').run(handleRequest.jovo)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.middleware('$inputs').run(handleRequest.jovo)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CorePlatform.prototype.beforeTTS = function (handleRequest) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'WebAssistantSkill') {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        console.log('[WebAssistant] { before.tts }');
                        return [4 /*yield*/, this.middleware('$tts.before').run(handleRequest.jovo)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CorePlatform.prototype.tts = function (handleRequest) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'WebAssistantSkill') {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        console.log('[WebAssistant] { tts }');
                        return [4 /*yield*/, this.middleware('$tts').run(handleRequest.jovo)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CorePlatform.prototype.output = function (handleRequest) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'WebAssistantSkill') {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        console.log('[WebAssistant] { platform.output }');
                        return [4 /*yield*/, this.middleware('$output').run(handleRequest.jovo)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CorePlatform.prototype.response = function (handleRequest) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'WebAssistantSkill') {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        console.log('[WebAssistant] { response }');
                        return [4 /*yield*/, this.middleware('$response').run(handleRequest.jovo)];
                    case 1:
                        _a.sent();
                        // handleRequest.jovo.$response = handleRequest.jovo.$rawResponseJson ? this.responseBuilder.create(handleRequest.jovo.$rawResponseJson) : handleRequest.jovo.$response;
                        return [4 /*yield*/, handleRequest.host.setResponse(handleRequest.jovo.$response)];
                    case 2:
                        // handleRequest.jovo.$response = handleRequest.jovo.$rawResponseJson ? this.responseBuilder.create(handleRequest.jovo.$rawResponseJson) : handleRequest.jovo.$response;
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CorePlatform.prototype.makeTestSuite = function () {
        return new jovo_core_1.TestSuite(new _1.CorePlatformRequestBuilder(), new _1.CorePlatformResponseBuilder());
    };
    CorePlatform.prototype.uninstall = function (app) { };
    CorePlatform.prototype.getSamplesFromAudio = function (base64) {
        var binaryBuffer = Buffer.from(base64, 'base64').toString('binary');
        var length = binaryBuffer.length / Float32Array.BYTES_PER_ELEMENT;
        var view = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
        var samples = new Float32Array(length);
        for (var i = 0; i < length; i++) {
            var p = i * 4;
            view.setUint8(0, binaryBuffer.charCodeAt(p));
            view.setUint8(1, binaryBuffer.charCodeAt(p + 1));
            view.setUint8(2, binaryBuffer.charCodeAt(p + 2));
            view.setUint8(3, binaryBuffer.charCodeAt(p + 3));
            samples[i] = view.getFloat32(0, true);
        }
        return samples;
    };
    return CorePlatform;
}(jovo_core_1.Extensible));
exports.CorePlatform = CorePlatform;
