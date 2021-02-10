"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../src");
const _get = require("lodash.get");
const _set = require("lodash.set");
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(550);
beforeEach(() => {
    app = new jovo_framework_1.App();
    const ga = new src_1.GoogleAssistant();
    app.use(ga);
    t = ga.makeTestSuite();
});
test('ask with multiple reprompts', async (done) => {
    app.setHandler({
        LAUNCH() {
            this.$googleAction.ask('Hello World!', 'Hello? 1', 'Hello? 2', 'Hello? 3');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        expect(handleRequest.jovo.$response.isAsk('Hello World!')).toBe(true);
        expect(_get(handleRequest.jovo.$response, 'payload.google.noInputPrompts[0].ssml')).toBe('<speak>Hello? 1</speak>');
        expect(_get(handleRequest.jovo.$response, 'payload.google.noInputPrompts[1].ssml')).toBe('<speak>Hello? 2</speak>');
        expect(_get(handleRequest.jovo.$response, 'payload.google.noInputPrompts[2].ssml')).toBe('<speak>Hello? 3</speak>');
        done();
    });
});
test('test generated id (no userId)', async (done) => {
    app.setHandler({
        LAUNCH() {
            this.tell('Hello World!');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    delete launchRequest.originalDetectIntentRequest.payload.user.userStorage;
    delete launchRequest.originalDetectIntentRequest.payload.user.userId;
    app.on('response', (handleRequest) => {
        const parsedUserStorage = JSON.parse(_get(handleRequest.jovo.$response, 'payload.google.userStorage'));
        expect(parsedUserStorage.userId).toEqual(expect.stringMatching(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/));
        done();
    });
});
test.skip('test generated id (existing userId)', async (done) => {
    app.setHandler({
        LAUNCH() {
            this.tell('Hello World!');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    delete launchRequest.originalDetectIntentRequest.payload.user.userStorage;
    _set(launchRequest, 'originalDetectIntentRequest.payload.user.userId', 'abcdef');
    app.on('response', (handleRequest) => {
        const parsedUserStorage = JSON.parse(_get(handleRequest.jovo.$response, 'payload.google.userStorage'));
        expect(parsedUserStorage.userId).toEqual('abcdef');
        done();
    });
});
test('test generated id (existing userId in storage)', async (done) => {
    app.setHandler({
        LAUNCH() {
            this.tell('Hello World!');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    _set(launchRequest, 'originalDetectIntentRequest.payload.user.userStorage', '{"userId":"ABC123"}');
    app.on('response', (handleRequest) => {
        const parsedUserStorage = JSON.parse(_get(handleRequest.jovo.$response, 'payload.google.userStorage'));
        expect(parsedUserStorage.userId).toEqual('ABC123');
        done();
    });
});
//# sourceMappingURL=basics.test.js.map