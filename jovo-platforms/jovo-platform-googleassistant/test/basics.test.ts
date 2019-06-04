import {HandleRequest, JovoRequest, TestSuite} from "jovo-core";
import {App, ExpressJS} from "jovo-framework";
import {GoogleAssistant} from "../src";
import _get = require('lodash.get');
import _set = require('lodash.set');

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);

beforeEach(() => {
    app = new App();
    const ga = new GoogleAssistant();
    app.use(ga);
    t = ga.makeTestSuite();
});


test('ask with multiple reprompts', async (done) => {
    app.setHandler({
        LAUNCH() {
            this.$googleAction!.ask('Hello World!', 'Hello? 1','Hello? 2', 'Hello? 3');
        },
    });

    const launchRequest:JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isAsk('Hello World!')).toBe(true);


        expect(_get(handleRequest.jovo!.$response!, 'payload.google.noInputPrompts[0].ssml')).toBe('<speak>Hello? 1</speak>');
        expect(_get(handleRequest.jovo!.$response!, 'payload.google.noInputPrompts[1].ssml')).toBe('<speak>Hello? 2</speak>');
        expect(_get(handleRequest.jovo!.$response!, 'payload.google.noInputPrompts[2].ssml')).toBe('<speak>Hello? 3</speak>');


        done();
    });
});

test('test generated id (no userId)', async (done) => {
    app.setHandler({
        LAUNCH() {
            this.tell('Hello World!');
        },
    });

    const launchRequest:JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    // @ts-ignore
    delete launchRequest.originalDetectIntentRequest.payload.user.userId;


    app.on('response', (handleRequest: HandleRequest) => {
        const parsedUserStorage = JSON.parse(_get(handleRequest.jovo!.$response!, 'payload.google.userStorage'));
        expect(parsedUserStorage.userId).toEqual(expect.stringMatching(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/));
        done();
    });
});

test('test generated id (existing userId)', async (done) => {
    app.setHandler({
        LAUNCH() {
            this.tell('Hello World!');
        },
    });

    const launchRequest:JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    // @ts-ignore
    _set(launchRequest, 'originalDetectIntentRequest.payload.user.userId', 'abcdef');


    app.on('response', (handleRequest: HandleRequest) => {
        const parsedUserStorage = JSON.parse(_get(handleRequest.jovo!.$response!, 'payload.google.userStorage'));
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

    const launchRequest:JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    // @ts-ignore
    _set(launchRequest, 'originalDetectIntentRequest.payload.user.userStorage',  "{\"userId\":\"ABC123\"}");

    app.on('response', (handleRequest: HandleRequest) => {
        const parsedUserStorage = JSON.parse(_get(handleRequest.jovo!.$response!, 'payload.google.userStorage'));
        expect(parsedUserStorage.userId).toEqual('ABC123');
        done();
    });
});
