"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const jovo_core_1 = require("jovo-core");
const jovo_db_filedb_1 = require("jovo-db-filedb");
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../../src");
const GoogleBusinessMockNlu_1 = require("./helper/GoogleBusinessMockNlu");
const Utils_1 = require("./helper/Utils");
// GoogleBusinessRequest can be used to add NLU data only if the NODE_ENV is set to "UNIT_TEST"
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(550);
/**
 * NLU:
 * We use a mock NLU to process the NLU data added to the requests. That's only done for the integration's own tests.
 * When the integration is used in production, one can use the project's NLU.
 *
 * DB:
 * Since Google Business Messages doesn't allow session attributes in the request/response, we use a DB.
 */
beforeEach(() => {
    app = new jovo_framework_1.App();
    const googleBusiness = new src_1.GoogleBusiness();
    googleBusiness.response = jest.fn(); // mock function so no actual API calls are made
    googleBusiness.use(new GoogleBusinessMockNlu_1.GoogleBusinessMockNlu());
    app.use(googleBusiness, new jovo_db_filedb_1.FileDb2({
        path: Utils_1.PATH_TO_DB_DIR,
    }));
    t = googleBusiness.makeTestSuite();
});
afterAll(() => {
    Utils_1.clearDbFolder();
});
describe('test request types', () => {
    // LAUNCH is not supported
    // test('test launch', async (done) => {
    //   app.setHandler({
    //     // tslint:disable-next-line
    //     LAUNCH() {},
    //   });
    //   const launchRequest: GoogleBusinessRequest = await t.requestBuilder.launch();
    //   app.handle(ExpressJS.dummyRequest(launchRequest));
    //   app.on('response', (handleRequest: HandleRequest) => {
    //     expect(handleRequest.jovo!.$type.type).toBe(EnumRequestType.LAUNCH);
    //     done();
    //   });
    // });
    test('test intent', async (done) => {
        app.setHandler({
            // tslint:disable-next-line
            HelloWorldIntent() { },
        });
        const request = await t.requestBuilder.intent('HelloWorldIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(jovo_core_1.EnumRequestType.INTENT);
            done();
        });
    });
    // END is not supported
    // test('test end', async (done) => {
    //   app.setHandler({
    //     // tslint:disable-next-line
    //     END() {},
    //   });
    //   const request: GoogleBusinessRequest = await t.requestBuilder.end();
    //   app.handle(ExpressJS.dummyRequest(request));
    //   app.on('response', (handleRequest: HandleRequest) => {
    //     expect(handleRequest.jovo!.$type.type).toBe(EnumRequestType.END);
    //     done();
    //   });
    // });
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
        Utils_1.setDbSessionData(intentRequest.getSessionId(), {
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
        // Business Messages integration uses session ID as user ID
        Utils_1.setDbSessionData(intentRequest.getSessionId(), {
            [jovo_core_1.SessionConstants.STATE]: 'TestState',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$session.$data[jovo_core_1.SessionConstants.STATE]).toBe('TestState');
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
        // Business Messages integration uses session ID as user ID
        Utils_1.setDbSessionData(intentRequest.getSessionId(), {
            [jovo_core_1.SessionConstants.STATE]: 'TestState',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$session.$data[jovo_core_1.SessionConstants.STATE]).toBeUndefined();
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
        // Business Messages integration uses session ID as user ID
        Utils_1.setDbSessionData(intentRequest.getSessionId(), {
            [jovo_core_1.SessionConstants.STATE]: 'TestState',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$session.$data[jovo_core_1.SessionConstants.STATE]).toBe('AnotherTestState');
            done();
        });
    });
});
describe('test toIntent', () => {
    test('no return', async (done) => {
        app.setHandler({
            TestIntent() {
                this.toIntent('HelloWorldIntent');
            },
            HelloWorldIntent() {
                this.tell('to intent');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
            done();
        });
    });
    test('with return', async (done) => {
        app.setHandler({
            TestIntent() {
                return this.toIntent('HelloWorldIntent');
            },
            HelloWorldIntent() {
                this.tell('to intent');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
            done();
        });
    });
    test('with async method in called method', async (done) => {
        app.setHandler({
            TestIntent() {
                return this.toIntent('HelloWorldIntent');
            },
            async HelloWorldIntent() {
                await delay(150);
                this.tell('to intent after delay');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
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
        // Business Messages integration uses session ID as user ID
        Utils_1.setDbSessionData(intentRequest.getSessionId(), {
            [jovo_core_1.SessionConstants.STATE]: 'State1',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
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
        // Business Messages integration uses session ID as user ID
        Utils_1.setDbSessionData(intentRequest.getSessionId(), {
            [jovo_core_1.SessionConstants.STATE]: 'State1',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
            done();
        });
    });
    test('test multiple toIntents', async (done) => {
        app.setHandler({
            TestIntent() {
                return this.toIntent('IntentA');
            },
            IntentA() {
                return this.toIntent('IntentB');
            },
            IntentB() {
                this.tell('Hello IntentB');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
            done();
        });
    });
    // LAUNCH is not supported
    // test('test from ON_REQUEST with skipping LAUNCH', async (done) => {
    //   app.setHandler({
    //     ON_REQUEST() {
    //       return this.toIntent('IntentA');
    //     },
    //     LAUNCH() {
    //       this.tell('LAUNCH');
    //     },
    //     IntentA() {
    //       this.tell('Hello toIntent');
    //     },
    //   });
    //   const launchRequest: GoogleBusinessRequest = await t.requestBuilder.launch();
    //   app.handle(ExpressJS.dummyRequest(launchRequest));
    //   app.on('response', (handleRequest: HandleRequest) => {
    //     expect(handleRequest.jovo!.$response!.isTell('Hello toIntent')).toBe(true);
    //     done();
    //   });
    // });
});
describe('test toStateIntent', () => {
    test('no return', async (done) => {
        app.setHandler({
            TestIntent() {
                this.toStateIntent('State', 'HelloWorldIntent');
            },
            State: {
                HelloWorldIntent() {
                    this.tell('to intent');
                },
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
            done();
        });
    });
    test('with return', async (done) => {
        app.setHandler({
            TestIntent() {
                return this.toStateIntent('State', 'HelloWorldIntent');
            },
            State: {
                HelloWorldIntent() {
                    this.tell('to intent');
                },
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
            done();
        });
    });
});
describe('test followUpState', () => {
    test('test add followUpstate to session attributes', async (done) => {
        app.setHandler({
            TestIntent() {
                this.followUpState('State1').ask('Hello World', 'foo');
            },
            State1: {
                // tslint:disable-next-line
                IntentA() { },
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$session.$data[jovo_core_1.SessionConstants.STATE]).toBe('State1');
            expect(handleRequest.jovo.$response.isAsk('Hello World')).toBe(true);
            done();
        });
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
        // Business Messages integration uses session ID as user ID
        Utils_1.setDbSessionData(intentRequest.getSessionId(), {
            [jovo_core_1.SessionConstants.STATE]: 'State1',
        });
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
});
describe('test handleOnRequest', () => {
    test('no ON_REQUEST', async (done) => {
        app.setHandler({
            TestIntent() {
                expect(this.$data.foo).toBe(undefined);
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('ON_REQUEST synchronous', async (done) => {
        app.setHandler({
            ON_REQUEST() {
                this.$data.foo = 'bar';
            },
            TestIntent() {
                expect(this.$data.foo).toBe('bar');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
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
            TestIntent() {
                expect(this.$data.foo).toBe('bar2');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
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
            TestIntent() {
                expect(this.$data.foo).toBe('bar3');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('ON_REQUEST return and skip intent handling', async (done) => {
        app.setHandler({
            ON_REQUEST() {
                return this.tell('ON_REQUEST');
            },
            TestIntent() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('ON_REQUEST')).toBeTruthy();
            done();
        });
    });
    test('ON_REQUEST skip intent handling inside of a callback', async (done) => {
        app.setHandler({
            ON_REQUEST(jovo, callback) {
                setTimeout(() => {
                    this.tell('ON_REQUEST').skipIntentHandling();
                    callback();
                }, 5);
            },
            TestIntent() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('ON_REQUEST')).toBeTruthy();
            done();
        });
    });
});
describe('test handleOnNewSession', () => {
    test('no NEW_SESSION', async (done) => {
        app.setHandler({
            TestIntent() {
                expect(this.$data.foo).toBe(undefined);
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
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
        // Business Messages integration uses session ID as user ID
        fs_1.writeFileSync(`${Utils_1.PATH_TO_DB_DIR}/${intentRequest.getSessionId()}.json`, JSON.stringify(dbJson));
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
            TestIntent() {
                expect(this.$data.foo).toBe('bar');
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
    test('NEW_SESSION asynchronous with promise', async (done) => {
        app.setHandler({
            NEW_SESSION() {
                return new Promise((resolve) => {
                    this.$data.foo = 'bar2';
                    resolve();
                });
            },
            TestIntent() {
                expect(this.$data.foo).toBe('bar2');
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
    test('NEW_SESSION asynchronous with callback parameter', async (done) => {
        app.setHandler({
            NEW_SESSION(jovo, d) {
                setTimeout(() => {
                    this.$data.foo = 'bar3';
                    d();
                }, 10);
            },
            TestIntent() {
                expect(this.$data.foo).toBe('bar3');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
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
            TestIntent() {
                // skip this
            },
            NewUserIntent() {
                expect(this.$data.foo).toBe('bar');
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
    test('NEW_SESSION return and skip intent handling', async (done) => {
        app.setHandler({
            NEW_SESSION() {
                return this.tell('NEW_SESSION');
            },
            TestIntent() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
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
            TestIntent() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('NEW_SESSION')).toBeTruthy();
            done();
        });
    });
});
describe('test handleOnNewUser', () => {
    /**
     * Business Messages uses the session ID as the user ID
     * For the framework to recognize the request as a new user, we have to add a
     * session ID that is not yet stored in the database.
     */
    test('no NEW_USER', async (done) => {
        app.setHandler({
            TestIntent() {
                expect(this.$data.foo).toBe(undefined);
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        // add a database entry for the user (same session ID), so NEW_USER won't be triggered
        const dbJson = {
            userData: {
                data: {},
                session: {
                    id: intentRequest.getSessionId(),
                    lastUpdatedAt: new Date().toISOString(),
                },
            },
        };
        fs_1.writeFileSync(`${Utils_1.PATH_TO_DB_DIR}/${intentRequest.getSessionId()}.json`, JSON.stringify(dbJson));
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
    test('NEW_USER synchronous', async (done) => {
        app.setHandler({
            NEW_USER() {
                this.$data.foo = 'bar';
            },
            TestIntent() {
                expect(this.$data.foo).toBe('bar');
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
    test('NEW_USER asynchronous with promise', async (done) => {
        app.setHandler({
            NEW_USER() {
                return new Promise((resolve) => {
                    this.$data.foo = 'bar2';
                    resolve();
                });
            },
            TestIntent() {
                expect(this.$data.foo).toBe('bar2');
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
    test('NEW_USER asynchronous with callback parameter', async (done) => {
        app.setHandler({
            NEW_USER(jovo, d) {
                setTimeout(() => {
                    this.$data.foo = 'bar3';
                    d();
                }, 10);
            },
            TestIntent() {
                expect(this.$data.foo).toBe('bar3');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
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
            TestIntent() {
                // skip this
            },
            NewUserIntent() {
                expect(this.$data.foo).toBe('bar');
                done();
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
    });
    test('NEW_USER return and skip intent handling', async (done) => {
        app.setHandler({
            NEW_USER() {
                return this.tell('NEW_USER');
            },
            TestIntent() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
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
            TestIntent() {
                // skip this
                this.tell('LAUNCH');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('NEW_USER')).toBeTruthy();
            done();
        });
    });
});
describe('test routing', () => {
    test('test intentMap', async (done) => {
        app.setHandler({
            HelloIntent() {
                this.tell('Hello!');
            },
        });
        app.config.plugin.Router.intentMap = {
            HelloWorldIntent: 'HelloIntent',
        };
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
        app.config.plugin.Router.intentMap = {
            HelloWorldIntent: 'HelloIntent',
        };
        const request = await t.requestBuilder.intent('HelloWorldIntent');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test getRoute', async (done) => {
        app.setHandler({
            TestIntent() {
                const route = this.getRoute();
                expect(route.type).toEqual('INTENT');
                expect(route.intent).toBe('TestIntent');
                done();
            },
        });
        const request = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test getRoute with toIntent', async (done) => {
        app.setHandler({
            TestIntent() {
                return this.toIntent('HelloIntent');
            },
            HelloIntent() {
                const route = this.getRoute();
                expect(route.from).toEqual('TestIntent');
                expect(route.type).toEqual('INTENT');
                expect(route.intent).toEqual('HelloIntent');
                done();
            },
        });
        const request = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test getRoute with multiple toIntent', async (done) => {
        app.setHandler({
            TestIntent() {
                return this.toIntent('HelloIntent');
            },
            HelloIntent() {
                return this.toIntent('HelloWorldIntent');
            },
            HelloWorldIntent() {
                const route = this.getRoute();
                expect(route.from).toEqual('TestIntent/HelloIntent');
                expect(route.type).toEqual('INTENT');
                expect(route.intent).toEqual('HelloWorldIntent');
                done();
            },
        });
        const request = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
});
const delay = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
};
const randomUserId = () => {
    return ('user-' +
        Math.random().toString(36).substring(5) +
        '-' +
        Math.random().toString(36).substring(2));
};
//# sourceMappingURL=Routing.test.js.map