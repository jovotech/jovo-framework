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
var jovo_framework_1 = require("jovo-framework");
var src_1 = require("../src");
var RequestSLU_1 = require("./helper/RequestSLU");
console.log = function () {
};
process.env.NODE_ENV = 'UNIT_TEST';
var app;
var t;
jest.setTimeout(550);
var delay = function (ms) {
    return new Promise(function (r) { return setTimeout(r, ms); });
};
beforeEach(function () {
    app = new jovo_framework_1.App();
    var webAssistant = new src_1.CorePlatform();
    webAssistant.use(new RequestSLU_1.RequestSLU());
    app.use(webAssistant);
    t = webAssistant.makeTestSuite();
});
describe('test request types', function () {
    test('test launch', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$type.type).toBe(jovo_core_1.EnumRequestType.LAUNCH);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test intent', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        HelloWorldIntent: function () {
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('HelloWorldIntent', {})];
                case 1:
                    request = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$type.type).toBe(jovo_core_1.EnumRequestType.INTENT);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test end', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        END: function () {
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.end()];
                case 1:
                    request = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$type.type).toBe(jovo_core_1.EnumRequestType.END);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test tell', function () {
    test('tell plain text', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.tell('Hello World!');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('tell speechbuilder', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.$speech.addText('Hello World!');
                            this.tell(this.$speech);
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('tell ssml', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.tell('<speak>Hello <break time="100ms"/></speak>');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        // expect(handleRequest.jovo!.$response!.isTell('Hello <break time="100ms"/>')).toBe(true);
                        expect(handleRequest.jovo.$response.isTell('Hello ')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test ask', function () {
    test('ask plain text', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.ask('Hello World!', 'Reprompt');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isAsk('Hello World!', 'Reprompt')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('ask speechbuilder', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.$speech.addText('Hello World!');
                            this.$reprompt.addText('Reprompt!');
                            this.ask(this.$speech, this.$reprompt);
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isAsk('Hello World!', 'Reprompt!')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('ask ssml', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.ask('<speak>Hello <break time="100ms"/></speak>', '<speak>Reprompt <break time="100ms"/></speak>');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        // expect(handleRequest.jovo!.$response!.isAsk('Hello <break time="100ms"/>', 'Reprompt <break time="100ms"/>')).toBe(true);
                        expect(handleRequest.jovo.$response.isAsk('Hello ', 'Reprompt ')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test $inputs', function () {
    test('test getInput, $inputs', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        HelloWorldIntent: function () {
                            expect(this.getInput('name').value).toBe('Joe');
                            expect(this.$inputs.name.value).toBe('Joe');
                            done();
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('HelloWorldIntent', {
                            name: 'Joe',
                        })];
                case 1:
                    intentRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
                    return [2 /*return*/];
            }
        });
    }); });
    test('test mapInputs', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setConfig({
                        inputMap: {
                            'given-name': 'name',
                        },
                    });
                    app.setHandler({
                        HelloWorldIntent: function () {
                            expect(this.getInput('name').value).toBe('Joe');
                            expect(this.$inputs.name.value).toBe('Joe');
                            done();
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('HelloWorldIntent', {
                            'given-name': 'Joe',
                        })];
                case 1:
                    intentRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
                    return [2 /*return*/];
            }
        });
    }); }, 100);
});
describe('test intentMap', function () {
    test('test inputMap', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setConfig({
                        intentMap: {
                            'HelloWorldIntent': 'MappedHelloWorldIntent',
                        },
                    });
                    app.setHandler({
                        MappedHelloWorldIntent: function () {
                            expect(true).toBe(true);
                            done();
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('HelloWorldIntent', {})];
                case 1:
                    intentRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
                    return [2 /*return*/];
            }
        });
    }); }, 100);
    test('test inputMap with predefined handler path', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setConfig({
                        intentMap: {
                            'Stop.Intent': 'END',
                        },
                    });
                    app.setHandler({
                        END: function () {
                            expect(true).toBe(true);
                            done();
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('Stop.Intent', {})];
                case 1:
                    intentRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
                    return [2 /*return*/];
            }
        });
    }); }, 100);
});
describe('test $data', function () {
    test('test different scopes', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.$app.$data.appData = 'appData';
                            this.$data.thisData = 'thisData';
                            this.$session.$data.sessionData = 'sessionData';
                            this.toIntent('HelloWorldIntent');
                        },
                        HelloWorldIntent: function () {
                            this.ask('foo', 'bar');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$app.$data.appData).toBe('appData');
                        expect(handleRequest.jovo.$data.thisData).toBe('thisData');
                        expect(handleRequest.jovo.$response.hasSessionAttribute('sessionData', 'sessionData')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test state', function () {
    test('test getState', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    app.setHandler({
                        TestState: {
                            SessionIntent: function () {
                                expect(this.getState()).toBe('TestState');
                                done();
                            },
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('SessionIntent', {})];
                case 1:
                    intentRequest = _b.sent();
                    intentRequest.setSessionAttributes((_a = {},
                        _a[jovo_core_1.SessionConstants.STATE] = 'TestState',
                        _a));
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
                    return [2 /*return*/];
            }
        });
    }); });
    test('test keep state', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    app.setHandler({
                        TestState: {
                            SessionIntent: function () {
                                this.ask('Hello', 'World');
                            },
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('SessionIntent', {})];
                case 1:
                    intentRequest = _b.sent();
                    intentRequest.setSessionAttributes((_a = {},
                        _a[jovo_core_1.SessionConstants.STATE] = 'TestState',
                        _a));
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.hasSessionAttribute(jovo_core_1.SessionConstants.STATE, 'TestState')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test removeState', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    app.setHandler({
                        TestState: {
                            SessionIntent: function () {
                                this.removeState();
                                this.ask('Hello', 'World');
                            },
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('SessionIntent', {})];
                case 1:
                    intentRequest = _b.sent();
                    intentRequest.setSessionAttributes((_a = {},
                        _a[jovo_core_1.SessionConstants.STATE] = 'TestState',
                        _a));
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.hasSessionAttribute(jovo_core_1.SessionConstants.STATE)).toBe(false);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test setState', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    app.setHandler({
                        TestState: {
                            SessionIntent: function () {
                                this.setState('AnotherTestState');
                                this.ask('Hello', 'World');
                            },
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('SessionIntent', {})];
                case 1:
                    intentRequest = _b.sent();
                    intentRequest.setSessionAttributes((_a = {},
                        _a[jovo_core_1.SessionConstants.STATE] = 'TestState',
                        _a));
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.hasSessionAttribute(jovo_core_1.SessionConstants.STATE, 'AnotherTestState')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test session attributes', function () {
    test('test get session', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        SessionIntent: function () {
                            expect(this.getSessionAttribute('sessionName1')).toBe('sessionValue1');
                            expect(this.$session.$data.sessionName2).toBe('sessionValue2');
                            this.ask('Foo', 'Bar');
                            done();
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('SessionIntent', {})];
                case 1:
                    intentRequest = _a.sent();
                    intentRequest.setSessionAttributes({
                        sessionName1: 'sessionValue1',
                        sessionName2: 'sessionValue2',
                    });
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
                    return [2 /*return*/];
            }
        });
    }); });
    test('test set session', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.setSessionAttribute('sessionName1', 'sessionValue1');
                            this.addSessionAttribute('sessionName2', 'sessionValue2');
                            this.$session.$data.sessionName3 = 'sessionValue3';
                            this.ask('Foo', 'Bar');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName1', 'sessionValue1')).toBe(true);
                        expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName2', 'sessionValue2')).toBe(true);
                        expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName3', 'sessionValue3')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test setSessionAttributes', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.setSessionAttributes({
                                sessionName1: 'sessionValue1',
                                sessionName2: 'sessionValue2',
                                sessionName3: 'sessionValue3',
                            });
                            this.ask('Foo', 'Bar');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName1', 'sessionValue1')).toBe(true);
                        expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName2', 'sessionValue2')).toBe(true);
                        expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName3', 'sessionValue3')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test toIntent', function () {
    test('no return', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.toIntent('HelloWorldIntent');
                        },
                        HelloWorldIntent: function () {
                            this.tell('to intent');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('with return', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        'LAUNCH': function () {
                            return this.toIntent('HelloWorldIntent');
                        },
                        HelloWorldIntent: function () {
                            this.tell('to intent');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('with async method in called method', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        'LAUNCH': function () {
                            return this.toIntent('HelloWorldIntent');
                        },
                        HelloWorldIntent: function () {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, delay(150)];
                                        case 1:
                                            _a.sent();
                                            this.tell('to intent after delay');
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('to intent after delay')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test within the same state', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        State1: {
                            IntentA: function () {
                                return this.toIntent('IntentB');
                            },
                            IntentB: function () {
                                this.tell('Hello IntentB');
                            },
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('IntentA')];
                case 1:
                    intentRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest.setState('State1')));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test in global handler', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        State1: {
                            IntentA: function () {
                                return this.toIntent('IntentB');
                            },
                        },
                        IntentB: function () {
                            this.tell('Hello IntentB');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('IntentA')];
                case 1:
                    intentRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest.setState('State1')));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test multiple toIntents', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            return this.toIntent('IntentA');
                        },
                        IntentA: function () {
                            return this.toIntent('IntentB');
                        },
                        IntentB: function () {
                            this.tell('Hello IntentB');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test from ON_REQUEST with skipping LAUNCH', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        ON_REQUEST: function () {
                            return this.toIntent('IntentA');
                        },
                        LAUNCH: function () {
                            this.tell('LAUNCH');
                        },
                        IntentA: function () {
                            this.tell('Hello toIntent');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('Hello toIntent')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test toStateIntent', function () {
    test('no return', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.toStateIntent('State', 'HelloWorldIntent');
                        },
                        State: {
                            HelloWorldIntent: function () {
                                this.tell('to intent');
                            },
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('with return', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            return this.toStateIntent('State', 'HelloWorldIntent');
                        },
                        State: {
                            HelloWorldIntent: function () {
                                this.tell('to intent');
                            },
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test followUpState', function () {
    test('test add followUpstate to session attributes', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.followUpState('State1').ask('Hello World', 'foo');
                        },
                        State1: {
                            IntentA: function () {
                            },
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.hasState('State1')).toBe(true);
                        expect(handleRequest.jovo.$response.isAsk('Hello World')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test removeState', function () {
    test('test add followUpstate to session attributes', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var intentRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        'State1': {
                            IntentA: function () {
                                expect(this.getState()).toBe('State1');
                                this.removeState();
                                expect(this.getState()).toBe(undefined);
                                done();
                            },
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.intent('IntentA')];
                case 1:
                    intentRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest.setState('State1')));
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test handleOnRequest', function () {
    test('no ON_REQUEST', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            expect(this.$data.foo).toBe(undefined);
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('ON_REQUEST synchronous', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        ON_REQUEST: function () {
                            this.$data.foo = 'bar';
                        },
                        LAUNCH: function () {
                            expect(this.$data.foo).toBe('bar');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('ON_REQUEST asynchronous with promise', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        ON_REQUEST: function () {
                            var _this = this;
                            return new Promise(function (resolve) {
                                _this.$data.foo = 'bar2';
                                resolve();
                            });
                        },
                        LAUNCH: function () {
                            expect(this.$data.foo).toBe('bar2');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('ON_REQUEST asynchronous with callback parameter', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        ON_REQUEST: function (jovo, d) {
                            var _this = this;
                            setTimeout(function () {
                                _this.$data.foo = 'bar3';
                                d();
                            }, 10);
                        },
                        LAUNCH: function () {
                            expect(this.$data.foo).toBe('bar3');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('ON_REQUEST return and skip intent handling', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        ON_REQUEST: function () {
                            return this.tell('ON_REQUEST');
                        },
                        LAUNCH: function () {
                            // skip this
                            this.tell('LAUNCH');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('ON_REQUEST')).toBeTruthy();
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('ON_REQUEST skip intent handling inside of a callback', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        ON_REQUEST: function (jovo, callback) {
                            var _this = this;
                            setTimeout(function () {
                                _this.tell('ON_REQUEST').skipIntentHandling();
                                callback();
                            }, 5);
                        },
                        LAUNCH: function () {
                            // skip this
                            this.tell('LAUNCH');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('ON_REQUEST')).toBeTruthy();
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test app listener', function () {
    test('test onRequest', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                        },
                    });
                    app.onRequest(function (handleRequest) {
                        expect(handleRequest.jovo).toBeUndefined();
                        expect(handleRequest.host.$request).toBeDefined();
                        done();
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    return [2 /*return*/];
            }
        });
    }); });
    test('test onResponse', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.tell('Hello World!');
                        },
                    });
                    app.onResponse(function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
                        done();
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    return [2 /*return*/];
            }
        });
    }); });
    test('test onFail', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(1);
                    // @ts-ignore
                    process.env.JOVO_LOG_LEVEL = jovo_core_1.LogLevel.NONE;
                    app.setHandler({
                        LAUNCH: function () {
                            throw new Error('Error ABC');
                        },
                    });
                    app.onFail(function (handleRequest) {
                        expect(handleRequest.error.message).toBe('Error ABC');
                        done();
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    return [2 /*return*/];
            }
        });
    }); });
    test('test onError', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(1);
                    // @ts-ignore
                    process.env.JOVO_LOG_LEVEL = jovo_core_1.LogLevel.NONE;
                    app.setHandler({
                        LAUNCH: function () {
                            throw new Error('Error ABC');
                        },
                    });
                    app.onError(function (handleRequest) {
                        expect(handleRequest.error.message).toBe('Error ABC');
                        done();
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test app config', function () {
    test('test keepSessionDataOnSessionEnded (default = false) ', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.$session.$data.foo = 'bar';
                            this.tell('Hello World!');
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.hasSessionAttribute('foo')).toBe(false);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test keepSessionDataOnSessionEnded (true) ', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var launchRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            this.$session.$data.foo = 'bar';
                            this.tell('Hello World!');
                        },
                    });
                    // @ts-ignore
                    app.config.keepSessionDataOnSessionEnded = true;
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    launchRequest = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.hasSessionAttribute('foo')).toBe(true);
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('test routing', function () {
    test('test intentMap', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        HelloIntent: function () {
                            this.tell('Hello!');
                        },
                    });
                    app.config.plugin.Router.intentMap = {
                        'HelloWorldIntent': 'HelloIntent',
                    };
                    return [4 /*yield*/, t.requestBuilder.intent('HelloWorldIntent')];
                case 1:
                    request = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
                    app.on('response', function (handleRequest) {
                        expect(handleRequest.jovo.$response.isTell('Hello!')).toBeTruthy();
                        done();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('test getIntentName and getMappedIntentName', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        HelloIntent: function () {
                            expect(this.getIntentName()).toEqual('HelloWorldIntent');
                            expect(this.getMappedIntentName()).toEqual('HelloIntent');
                            done();
                        },
                    });
                    app.config.plugin.Router.intentMap = {
                        'HelloWorldIntent': 'HelloIntent',
                    };
                    return [4 /*yield*/, t.requestBuilder.intent('HelloWorldIntent')];
                case 1:
                    request = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
                    return [2 /*return*/];
            }
        });
    }); });
    test('test getRoute', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            var route = this.getRoute();
                            expect(route.type).toEqual('LAUNCH');
                            expect(route.intent).toBeUndefined();
                            done();
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    request = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
                    return [2 /*return*/];
            }
        });
    }); });
    test('test getRoute with toIntent', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            return this.toIntent('HelloIntent');
                        },
                        HelloIntent: function () {
                            var route = this.getRoute();
                            expect(route.from).toEqual('LAUNCH');
                            expect(route.type).toEqual('INTENT');
                            expect(route.intent).toEqual('HelloIntent');
                            done();
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    request = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
                    return [2 /*return*/];
            }
        });
    }); });
    test('test getRoute with multiple toIntent', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.setHandler({
                        LAUNCH: function () {
                            return this.toIntent('HelloIntent');
                        },
                        HelloIntent: function () {
                            return this.toIntent('HelloWorldIntent');
                        },
                        HelloWorldIntent: function () {
                            var route = this.getRoute();
                            expect(route.from).toEqual('LAUNCH/HelloIntent');
                            expect(route.type).toEqual('INTENT');
                            expect(route.intent).toEqual('HelloWorldIntent');
                            done();
                        },
                    });
                    return [4 /*yield*/, t.requestBuilder.launch()];
                case 1:
                    request = _a.sent();
                    app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
                    return [2 /*return*/];
            }
        });
    }); });
});
