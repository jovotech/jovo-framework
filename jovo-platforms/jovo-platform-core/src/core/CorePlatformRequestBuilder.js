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
var path = require("path");
var CorePlatformRequest_1 = require("./CorePlatformRequest");
var CorePlatformRequestBuilder = /** @class */ (function () {
    function CorePlatformRequestBuilder() {
        this.type = 'CorePlatformApp';
    }
    CorePlatformRequestBuilder.prototype.launch = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.launchRequest(json)];
            });
        });
    };
    CorePlatformRequestBuilder.prototype.launchRequest = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            return __generator(this, function (_a) {
                if (json) {
                    return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(json)];
                }
                else {
                    req = JSON.stringify(this.loadJson('LaunchRequest'));
                    return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString())];
                }
                return [2 /*return*/];
            });
        });
    };
    CorePlatformRequestBuilder.prototype.intent = function (obj, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var req, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof obj === 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.intentRequest()];
                    case 1:
                        req = _a.sent();
                        req.setIntentName(obj);
                        if (inputs) {
                            for (input in inputs) {
                                if (inputs.hasOwnProperty(input)) {
                                    req.addInput(input, inputs[input]);
                                }
                            }
                        }
                        return [2 /*return*/, req];
                    case 2: return [2 /*return*/, this.intentRequest(obj)];
                }
            });
        });
    };
    CorePlatformRequestBuilder.prototype.intentRequest = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            return __generator(this, function (_a) {
                if (json) {
                    return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(json)];
                }
                else {
                    req = JSON.stringify(this.loadJson('IntentRequest'));
                    return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString())];
                }
                return [2 /*return*/];
            });
        });
    };
    CorePlatformRequestBuilder.prototype.rawRequest = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(json)];
            });
        });
    };
    CorePlatformRequestBuilder.prototype.rawRequestByKey = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            return __generator(this, function (_a) {
                req = JSON.stringify(this.loadJson(key));
                return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(JSON.parse(req))];
            });
        });
    };
    CorePlatformRequestBuilder.prototype.audioPlayerRequest = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            return __generator(this, function (_a) {
                if (json) {
                    return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(json)];
                }
                else {
                    req = JSON.stringify(this.loadJson('AudioPlayerRequest'));
                    return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString())];
                }
                return [2 /*return*/];
            });
        });
    };
    CorePlatformRequestBuilder.prototype.end = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                if (json) {
                    return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(json)];
                }
                else {
                    request = JSON.stringify(this.loadJson('SessionEndedRequest'));
                    return [2 /*return*/, CorePlatformRequest_1.CorePlatformRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString())];
                }
                return [2 /*return*/];
            });
        });
    };
    CorePlatformRequestBuilder.prototype.getJsonPath = function (key, version) {
        var folder = './../../../';
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            folder = './../../';
        }
        var fileName = key + ".json";
        if (!fileName) {
            throw new Error("Can't find file.");
        }
        return path.join(folder, 'sample-request-json', version, fileName);
    };
    CorePlatformRequestBuilder.prototype.loadJson = function (key, version) {
        if (version === void 0) { version = 'v1'; }
        return require(this.getJsonPath(key, version));
    };
    return CorePlatformRequestBuilder;
}());
exports.CorePlatformRequestBuilder = CorePlatformRequestBuilder;
