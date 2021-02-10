"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const jovo_framework_1 = require("jovo-framework");
const jovo_db_filedb_1 = require("jovo-db-filedb");
const _set = require("lodash.set");
const fs = require("fs");
const path = require("path");
const src_1 = require("../src");
const PATH_TO_DB_DIR = './test/db';
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(550);
const delay = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
};
beforeEach(() => {
    app = new jovo_framework_1.App({
        user: {
            sessionData: {
                enabled: true,
                id: true,
            },
        },
    });
    const autopilot = new src_1.Autopilot();
    app.use(new jovo_db_filedb_1.FileDb2({
        path: PATH_TO_DB_DIR,
    }), autopilot);
    t = autopilot.makeTestSuite();
});
afterAll(async () => {
    /**
     * Tests finish before the last FileDb JSON file is saved in the `db` folder.
     * That resulted in JSON files still being present after tests were finished.
     * Since the tests don't depend on the JSOn files being saved, it doesn't really matter,
     * but to always keep the db folder clear,
     * we set a small delay (500ms) before we clear the folder.
     */
    await delay(500);
    clearDbFolder();
});
describe('test request types', () => {
    test('test launch', async (done) => {
        app.setHandler({
            LAUNCH() { },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(jovo_core_1.EnumRequestType.LAUNCH);
            done();
        });
    });
    test('test intent', async (done) => {
        app.setHandler({
            HelloWorldIntent() { },
        });
        const request = await t.requestBuilder.intent('HelloWorldIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(jovo_core_1.EnumRequestType.INTENT);
            done();
        });
    });
    test('test end', async (done) => {
        app.setHandler({
            END() { },
        });
        const request = await t.requestBuilder.end();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(jovo_core_1.EnumRequestType.END);
            done();
        });
    });
    test('test end global', async (done) => {
        app.setHandler({
            END() {
                done();
            },
        });
        const request = await t.requestBuilder.end();
        request.setState('State');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test end in state', async (done) => {
        app.setHandler({
            State: {
                END() {
                    done();
                },
            },
        });
        const request = await t.requestBuilder.end();
        request.setState('State');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test end in multilevel state', async (done) => {
        app.setHandler({
            State1: {
                State2: {
                    END() {
                        done();
                    },
                },
            },
        });
        const request = await t.requestBuilder.end();
        request.setState('State1.State2');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test end without end', async (done) => {
        app.setHandler({});
        const request = await t.requestBuilder.end();
        request.setState('State1.State2');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(jovo_core_1.EnumRequestType.END);
            done();
        });
    });
    test('test end (with state) in global ', async (done) => {
        app.setHandler({
            State1: {},
            END() {
                done();
            },
        });
        const request = await t.requestBuilder.end();
        request.setState('State1');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
});
describe('test tell', () => {
    test('tell plain text', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.tell('Hello World!');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
            done();
        });
    });
    test('tell speechbuilder', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$speech.addText('Hello World!');
                this.tell(this.$speech);
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
            done();
        });
    });
    test('tell ssml', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.tell('Hello <break time="100ms"/>');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello <break time="100ms"/>')).toBe(true);
            done();
        });
    });
});
describe('test ask', () => {
    test('ask plain text', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.ask('Hello World!', 'Reprompt');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isAsk('Hello World!', 'Reprompt')).toBe(true);
            done();
        });
    });
    test('ask speechbuilder', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$speech.addText('Hello World!');
                this.$reprompt.addText('Reprompt!');
                this.ask(this.$speech, this.$reprompt);
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isAsk('Hello World!', 'Reprompt!')).toBe(true);
            done();
        });
    });
    test('ask ssml', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.ask('Hello <break time="100ms"/>', 'Reprompt <break time="100ms"/>');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isAsk('Hello <break time="100ms"/>', 'Reprompt <break time="100ms"/>')).toBe(true);
            done();
        });
    });
});
describe('test $inputs', () => {
    test('test getInput, $inputs', async (done) => {
        app.setHandler({
            HelloWorldIntent() {
                expect(this.getInput('name').value).toBe('Joe');
                expect(this.$inputs.name.value).toBe('Joe');
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('HelloWorldIntent', {
            name: {
                name: 'name',
                value: 'Joe',
            },
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
    test('test mapInputs', async (done) => {
        app.setConfig({
            inputMap: {
                'given-name': 'name',
            },
        });
        app.setHandler({
            HelloWorldIntent() {
                expect(this.getInput('name').value).toBe('Joe');
                expect(this.$inputs.name.value).toBe('Joe');
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('HelloWorldIntent', {
            'given-name': {
                name: 'given-name',
                value: 'Joe',
            },
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    }, 100);
});
describe('test intentMap', () => {
    test('test intentMap', async (done) => {
        app.setConfig({
            intentMap: {
                HelloWorldIntent: 'MappedHelloWorldIntent',
            },
        });
        app.setHandler({
            MappedHelloWorldIntent() {
                expect(true).toBe(true);
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('HelloWorldIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    }, 100);
    test('test intentMap with predefined handler path', async (done) => {
        app.setConfig({
            intentMap: {
                'Stop.Intent': 'END',
            },
        });
        app.setHandler({
            END() {
                expect(true).toBe(true);
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('Stop.Intent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    }, 100);
});
describe('test $data', () => {
    test('test different scopes', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$app.$data.appData = 'appData';
                this.$data.thisData = 'thisData';
                this.$session.$data.sessionData = 'sessionData';
                this.toIntent('HelloWorldIntent');
            },
            HelloWorldIntent() {
                this.ask('foo', 'bar');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$app.$data.appData).toBe('appData');
            expect(handleRequest.jovo.$data.thisData).toBe('thisData');
            expect(handleRequest.jovo.$response.hasSessionAttribute('sessionData', 'sessionData')).toBe(true);
            done();
        });
    });
});
describe('test state', () => {
    test('test getState', async (done) => {
        app.setHandler({
            TestState: {
                SessionIntent() {
                    expect(this.getState()).toBe('TestState');
                    done();
                },
            },
        });
        const intentRequest = await t.requestBuilder.intent('SessionIntent', {});
        intentRequest.setSessionAttributes({
            [jovo_core_1.SessionConstants.STATE]: 'TestState',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
    test('test keep state', async (done) => {
        app.setHandler({
            TestState: {
                SessionIntent() {
                    this.ask('Hello', 'World');
                },
            },
        });
        const intentRequest = await t.requestBuilder.intent('SessionIntent', {});
        intentRequest.setSessionAttributes({
            [jovo_core_1.SessionConstants.STATE]: 'TestState',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.hasSessionAttribute(jovo_core_1.SessionConstants.STATE, 'TestState')).toBe(true);
            done();
        });
    });
    test('test removeState', async (done) => {
        app.setHandler({
            TestState: {
                SessionIntent() {
                    this.removeState();
                    this.ask('Hello', 'World');
                },
            },
        });
        const intentRequest = await t.requestBuilder.intent('SessionIntent', {});
        intentRequest.setSessionAttributes({
            [jovo_core_1.SessionConstants.STATE]: 'TestState',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.hasSessionAttribute(jovo_core_1.SessionConstants.STATE)).toBe(false);
            done();
        });
    });
    test('test setState', async (done) => {
        app.setHandler({
            TestState: {
                SessionIntent() {
                    this.setState('AnotherTestState');
                    this.ask('Hello', 'World');
                },
            },
        });
        const intentRequest = await t.requestBuilder.intent('SessionIntent', {});
        intentRequest.setSessionAttributes({
            [jovo_core_1.SessionConstants.STATE]: 'TestState',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.hasSessionAttribute(jovo_core_1.SessionConstants.STATE, 'AnotherTestState')).toBe(true);
            done();
        });
    });
});
describe('test session attributes', () => {
    test('test get session', async (done) => {
        app.setHandler({
            SessionIntent() {
                expect(this.getSessionAttribute('sessionName1')).toBe('sessionValue1');
                expect(this.$session.$data.sessionName2).toBe('sessionValue2');
                this.ask('Foo', 'Bar');
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('SessionIntent', {});
        intentRequest.setSessionAttributes({
            sessionName1: 'sessionValue1',
            sessionName2: 'sessionValue2',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
    test('test set session', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.setSessionAttribute('sessionName1', 'sessionValue1');
                this.addSessionAttribute('sessionName2', 'sessionValue2');
                this.$session.$data.sessionName3 = 'sessionValue3';
                this.ask('Foo', 'Bar');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName1', 'sessionValue1')).toBe(true);
            expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName2', 'sessionValue2')).toBe(true);
            expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName3', 'sessionValue3')).toBe(true);
            done();
        });
    });
    test('test setSessionAttributes', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.setSessionAttributes({
                    sessionName1: 'sessionValue1',
                    sessionName2: 'sessionValue2',
                    sessionName3: 'sessionValue3',
                });
                this.ask('Foo', 'Bar');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName1', 'sessionValue1')).toBe(true);
            expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName2', 'sessionValue2')).toBe(true);
            expect(handleRequest.jovo.$response.hasSessionAttribute('sessionName3', 'sessionValue3')).toBe(true);
            done();
        });
    });
});
describe('test toIntent', () => {
    test('no return', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.toIntent('HelloWorldIntent');
            },
            HelloWorldIntent() {
                this.tell('to intent');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
            done();
        });
    });
    test('with return', async (done) => {
        app.setHandler({
            LAUNCH() {
                return this.toIntent('HelloWorldIntent');
            },
            HelloWorldIntent() {
                this.tell('to intent');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
            done();
        });
    });
    test('with async method in called method', async (done) => {
        app.setHandler({
            LAUNCH() {
                return this.toIntent('HelloWorldIntent');
            },
            async HelloWorldIntent() {
                await delay(150);
                this.tell('to intent after delay');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('to intent after delay')).toBe(true);
            done();
        });
    });
    test('test within the same state', async (done) => {
        app.setHandler({
            State1: {
                IntentA() {
                    return this.toIntent('IntentB');
                },
                IntentB() {
                    this.tell('Hello IntentB');
                },
            },
        });
        const intentRequest = await t.requestBuilder.intent('IntentA');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest.setState('State1')));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
            done();
        });
    });
    test('test in global handler', async (done) => {
        app.setHandler({
            State1: {
                IntentA() {
                    return this.toIntent('IntentB');
                },
            },
            IntentB() {
                this.tell('Hello IntentB');
            },
        });
        const intentRequest = await t.requestBuilder.intent('IntentA');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest.setState('State1')));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
            done();
        });
    });
    test('test multiple toIntents', async (done) => {
        app.setHandler({
            LAUNCH() {
                return this.toIntent('IntentA');
            },
            IntentA() {
                return this.toIntent('IntentB');
            },
            IntentB() {
                this.tell('Hello IntentB');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
            done();
        });
    });
    test('test from ON_REQUEST with skipping LAUNCH', async (done) => {
        app.setHandler({
            ON_REQUEST() {
                return this.toIntent('IntentA');
            },
            LAUNCH() {
                this.tell('LAUNCH');
            },
            IntentA() {
                this.tell('Hello toIntent');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello toIntent')).toBe(true);
            done();
        });
    });
});
describe('test toStateIntent', () => {
    test('no return', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.toStateIntent('State', 'HelloWorldIntent');
            },
            State: {
                HelloWorldIntent() {
                    this.tell('to intent');
                },
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
            done();
        });
    });
    test('with return', async (done) => {
        app.setHandler({
            LAUNCH() {
                return this.toStateIntent('State', 'HelloWorldIntent');
            },
            State: {
                HelloWorldIntent() {
                    this.tell('to intent');
                },
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
            done();
        });
    });
});
describe('test handleOnRequest', () => {
    test('no ON_REQUEST', async (done) => {
        app.setHandler({
            LAUNCH() {
                expect(this.$data.foo).toBe(undefined);
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('ON_REQUEST synchronous', async (done) => {
        app.setHandler({
            ON_REQUEST() {
                this.$data.foo = 'bar';
            },
            LAUNCH() {
                expect(this.$data.foo).toBe('bar');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('ON_REQUEST asynchronous with promise', async (done) => {
        app.setHandler({
            ON_REQUEST() {
                return new Promise((resolve) => {
                    this.$data.foo = 'bar2';
                    resolve();
                });
            },
            LAUNCH() {
                expect(this.$data.foo).toBe('bar2');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('ON_REQUEST asynchronous with callback parameter', async (done) => {
        app.setHandler({
            ON_REQUEST(jovo, d) {
                setTimeout(() => {
                    this.$data.foo = 'bar3';
                    d();
                }, 10);
            },
            LAUNCH() {
                expect(this.$data.foo).toBe('bar3');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('ON_REQUEST return and skip intent handling', async (done) => {
        app.setHandler({
            ON_REQUEST() {
                return this.tell('ON_REQUEST');
            },
            LAUNCH() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('ON_REQUEST')).toBeTruthy();
            done();
        });
    });
    test('ON_REQUEST skip intent handling inside of a callback', async (done) => {
        app.setHandler({
            NEW_SESSION(jovo, callback) {
                setTimeout(() => {
                    this.tell('ON_REQUEST').skipIntentHandling();
                    callback();
                }, 5);
            },
            LAUNCH() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('ON_REQUEST')).toBeTruthy();
            done();
        });
    });
});
describe('test handleOnNewSession', () => {
    test('no NEW_SESSION', async (done) => {
        app.setHandler({
            LAUNCH() {
                expect(this.$data.foo).toBe(undefined);
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('NEW_SESSION but request with old session', async (done) => {
        app.setHandler({
            NEW_SESSION() {
                // shouldn't be reached
                this.$data.foo = 'bar';
            },
            IntentA() {
                expect(this.$data.foo).toBe(undefined);
            },
        });
        const intentRequest = await t.requestBuilder.intent('IntentA');
        // session ID of the request and the one in DB have to be the same for NEW_SESSION to be skipped
        const dbJson = {
            userData: {
                data: {},
                session: {
                    id: intentRequest.getSessionId(),
                    lastUpdatedAt: new Date().toISOString(),
                },
            },
        };
        fs.writeFileSync(`${PATH_TO_DB_DIR}/${intentRequest.getUserId()}.json`, JSON.stringify(dbJson));
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('NEW_SESSION synchronous', async (done) => {
        app.setHandler({
            NEW_SESSION() {
                this.$data.foo = 'bar';
            },
            LAUNCH() {
                expect(this.$data.foo).toBe('bar');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
    test('NEW_SESSION asynchronous with promise', async (done) => {
        app.setHandler({
            NEW_SESSION() {
                return new Promise((resolve) => {
                    this.$data.foo = 'bar2';
                    resolve();
                });
            },
            LAUNCH() {
                expect(this.$data.foo).toBe('bar2');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
    test('NEW_SESSION asynchronous with callback parameter', async (done) => {
        app.setHandler({
            NEW_SESSION(jovo, d) {
                setTimeout(() => {
                    this.$data.foo = 'bar3';
                    d();
                }, 10);
            },
            LAUNCH() {
                expect(this.$data.foo).toBe('bar3');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('NEW_SESSION toIntent', async (done) => {
        app.setHandler({
            NEW_SESSION() {
                this.$data.foo = 'bar';
                return this.toIntent('NewUserIntent');
            },
            LAUNCH() {
                // skip this
            },
            NewUserIntent() {
                expect(this.$data.foo).toBe('bar');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
    test('NEW_SESSION return and skip intent handling', async (done) => {
        app.setHandler({
            NEW_SESSION() {
                return this.tell('NEW_SESSION');
            },
            LAUNCH() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('NEW_SESSION')).toBeTruthy();
            done();
        });
    });
    test('NEW_SESSION skip intent handling inside of a callback', async (done) => {
        app.setHandler({
            NEW_SESSION(jovo, callback) {
                setTimeout(() => {
                    this.tell('NEW_SESSION').skipIntentHandling();
                    callback();
                }, 5);
            },
            LAUNCH() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('NEW_SESSION')).toBeTruthy();
            done();
        });
    });
});
describe('test handleOnNewUser', () => {
    test('no NEW_USER', async (done) => {
        app.setHandler({
            NEW_USER() {
                this.$data.foo = 'bar';
            },
            LAUNCH() {
                expect(this.$data.foo).toBe(undefined);
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        // set db entry for the user
        const dbJson = {
            userData: {
                data: {},
                session: {
                    id: launchRequest.getSessionId(),
                    lastUpdatedAt: new Date().toISOString(),
                },
            },
        };
        fs.writeFileSync(`${PATH_TO_DB_DIR}/${launchRequest.getUserId()}.json`, JSON.stringify(dbJson));
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('NEW_USER synchronous', async (done) => {
        app.setHandler({
            NEW_USER() {
                this.$data.foo = 'bar';
            },
            LAUNCH() {
                expect(this.$data.foo).toBe('bar');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
    test('NEW_USER asynchronous with promise', async (done) => {
        app.setHandler({
            NEW_USER() {
                return new Promise((resolve) => {
                    this.$data.foo = 'bar2';
                    resolve();
                });
            },
            LAUNCH() {
                expect(this.$data.foo).toBe('bar2');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
    test('NEW_USER asynchronous with callback parameter', async (done) => {
        app.setHandler({
            NEW_USER(jovo, d) {
                setTimeout(() => {
                    this.$data.foo = 'bar3';
                    d();
                }, 10);
            },
            LAUNCH() {
                expect(this.$data.foo).toBe('bar3');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('NEW_USER toIntent', async (done) => {
        app.setHandler({
            NEW_USER() {
                this.$data.foo = 'bar';
                return this.toIntent('NewUserIntent');
            },
            LAUNCH() {
                // skip this
            },
            NewUserIntent() {
                expect(this.$data.foo).toBe('bar');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
    test('NEW_USER return and skip intent handling', async (done) => {
        app.setHandler({
            NEW_USER() {
                return this.tell('NEW_USER');
            },
            LAUNCH() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('NEW_USER')).toBeTruthy();
            done();
        });
    });
    test('NEW_USER skip intent handling inside of a callback', async (done) => {
        app.setHandler({
            NEW_USER(jovo, callback) {
                setTimeout(() => {
                    this.tell('NEW_USER').skipIntentHandling();
                    callback();
                }, 5);
            },
            LAUNCH() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('NEW_USER')).toBeTruthy();
            done();
        });
    });
});
describe('test NEW_USER + NEW_SESSION + ON_REQUEST', () => {
    test('correct order', async (done) => {
        app.setHandler({
            NEW_USER() {
                this.$data.foo = ['NEW_USER'];
            },
            NEW_SESSION() {
                this.$data.foo.push('NEW_SESSION');
            },
            ON_REQUEST() {
                this.$data.foo.push('ON_REQUEST');
            },
            LAUNCH() {
                this.$data.foo.push('LAUNCH');
                return this.toIntent('IntentAfterToIntent');
            },
            IntentAfterToIntent() {
                expect(this.$data.foo[0]).toBe('NEW_USER');
                expect(this.$data.foo[1]).toBe('NEW_SESSION');
                expect(this.$data.foo[2]).toBe('ON_REQUEST');
                expect(this.$data.foo[3]).toBe('LAUNCH');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
});
describe('test removeState', () => {
    test('test add followUpstate to session attributes', async (done) => {
        app.setHandler({
            State1: {
                IntentA() {
                    expect(this.getState()).toBe('State1');
                    this.removeState();
                    expect(this.getState()).toBe(undefined);
                    done();
                },
            },
        });
        const intentRequest = await t.requestBuilder.intent('IntentA');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest.setState('State1')));
    });
});
describe('test followUpState', () => {
    test('test add followUpstate to session attributes', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.followUpState('State1').ask('Hello World', 'foo');
            },
            State1: {
                IntentA() { },
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.hasState('State1')).toBe(true);
            expect(handleRequest.jovo.$response.isAsk('Hello World')).toBe(true);
            done();
        });
    });
});
describe('test app listener', () => {
    test('test onRequest', async (done) => {
        app.setHandler({
            LAUNCH() { },
        });
        app.onRequest((handleRequest) => {
            expect(handleRequest.jovo).toBeUndefined();
            expect(handleRequest.host.$request).toBeDefined();
            done();
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
    test('test onResponse', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.tell('Hello World!');
            },
        });
        app.onResponse((handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
            done();
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
    test('test onFail', async (done) => {
        expect.assertions(1);
        // @ts-ignore
        process.env.JOVO_LOG_LEVEL = jovo_core_1.LogLevel.NONE;
        app.setHandler({
            LAUNCH() {
                throw new Error('Error ABC');
            },
        });
        app.onFail((handleRequest) => {
            expect(handleRequest.error.message).toBe('Error ABC');
            done();
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
    test('test onError', async (done) => {
        expect.assertions(1);
        // @ts-ignore
        process.env.JOVO_LOG_LEVEL = jovo_core_1.LogLevel.NONE;
        app.setHandler({
            LAUNCH() {
                throw new Error('Error ABC');
            },
        });
        app.onError((handleRequest) => {
            expect(handleRequest.error.message).toBe('Error ABC');
            done();
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    });
});
describe('test routing', () => {
    test('test intentMap', async (done) => {
        app.setHandler({
            HelloIntent() {
                this.tell('Hello!');
            },
        });
        _set(app.config, 'plugin.Router.intentMap', {
            HelloWorldIntent: 'HelloIntent',
        });
        const request = await t.requestBuilder.intent('HelloWorldIntent');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello!')).toBeTruthy();
            done();
        });
    });
    test('test getIntentName and getMappedIntentName', async (done) => {
        app.setHandler({
            HelloIntent() {
                expect(this.getIntentName()).toEqual('HelloWorldIntent');
                expect(this.getMappedIntentName()).toEqual('HelloIntent');
                done();
            },
        });
        _set(app.config, 'plugin.Router.intentMap', {
            HelloWorldIntent: 'HelloIntent',
        });
        const request = await t.requestBuilder.intent('HelloWorldIntent');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test getRoute', async (done) => {
        app.setHandler({
            LAUNCH() {
                const route = this.getRoute();
                expect(route.type).toEqual('LAUNCH');
                expect(route.intent).toBeUndefined();
                done();
            },
        });
        const request = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test getRoute with toIntent', async (done) => {
        app.setHandler({
            LAUNCH() {
                return this.toIntent('HelloIntent');
            },
            HelloIntent() {
                const route = this.getRoute();
                expect(route.from).toEqual('LAUNCH');
                expect(route.type).toEqual('INTENT');
                expect(route.intent).toEqual('HelloIntent');
                done();
            },
        });
        const request = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test getRoute with multiple toIntent', async (done) => {
        app.setHandler({
            LAUNCH() {
                return this.toIntent('HelloIntent');
            },
            HelloIntent() {
                return this.toIntent('HelloWorldIntent');
            },
            HelloWorldIntent() {
                const route = this.getRoute();
                expect(route.from).toEqual('LAUNCH/HelloIntent');
                expect(route.type).toEqual('INTENT');
                expect(route.intent).toEqual('HelloWorldIntent');
                done();
            },
        });
        const request = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
});
function clearDbFolder() {
    const files = fs.readdirSync(PATH_TO_DB_DIR);
    files.forEach((file) => {
        fs.unlinkSync(path.join(PATH_TO_DB_DIR, file));
    });
}
exports.clearDbFolder = clearDbFolder;
//# sourceMappingURL=FrameworkBase.test.js.map