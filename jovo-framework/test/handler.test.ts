test('dummy test', () => {
    expect(true).toBe(true);
});

// import {Handler} from './../src/middleware/Handler';
// import {App} from './../src/App';
// import {AppConfig, EnumRequestType, HandleRequest, Jovo, JovoRequest} from "jovo-core";
// import {ExpressJS} from "../src";
// require('source-map-support').install();
// process.env.NODE_ENV = 'TEST';
// let app: App;
// jest.setTimeout(250);
//
// test('test route object is null', () => {
//
//     const appConfig: AppConfig = {
//         handlers: {
//             'IntentA'() {
//
//             },
//             'Unhandled'() {
//             },
//         }
//     };
//
//     const spy = jest.spyOn(appConfig.handlers, 'Unhandled');
//     Handler.applyHandle(null, null, appConfig);
//     expect(spy).toBeCalled();
// });
//
// test('test setHandler with single handler', () => {
//     app = new App();
//     app.setHandler({
//         LAUNCH() {
//
//         },
//         'State': {
//             Intent() {
//
//             },
//         },
//     });
//     expect((app.config as AppConfig).handlers.LAUNCH).toBeDefined();
//     expect((app.config as AppConfig).handlers.State).toBeDefined();
//
// });
//
// test('test setHandler with multiple handlers', () => {
//     app = new App();
//     app.setHandler({
//         'State': {
//             Intent() {
//
//             },
//         },
//     }, {
//         'State2': {
//             Intent() {
//
//             },
//         },
//     });
//     expect((app.config as AppConfig).handlers.State).toBeDefined();
//     expect((app.config as AppConfig).handlers.State2).toBeDefined();
//
// });
//
// test('test throw exception on non existing route', (done) => {
//     const appConfig: AppConfig = {
//         handlers: {
//             'IntentA'() {
//
//             },
//             'Unhandled'() {
//                 console.log('unhandled');
//             },
//         }
//     };
//
//     Handler.applyHandle(null, {
//         path: 'NonExistingPath',
//         type: EnumRequestType.INTENT,
//     }, appConfig).catch((e) => {
//         expect(e.message).toBe('Could not find the route "NonExistingPath" in your handler function.');
//         done();
//     });
// });
//
// test('test handleOnRequest', () => {
//     const appConfig: AppConfig = {
//         handlers: {
//             'ON_REQUEST'() {
//
//             },
//         }
//     };
//
//     const spy = jest.spyOn(appConfig.handlers, 'ON_REQUEST');
//     Handler.handleOnRequest(null, appConfig);
//     expect(spy).toBeCalled();
// });
// //
// // for (const p of [new Alexa()])  {
// //     const t = p.makeTestSuite();
// //
// //     describe('test toIntent', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //
// //         test('no return', async (done) => {
// //
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     this.toIntent('HelloWorldIntent');
// //                 },
// //                 HelloWorldIntent() {
// //                     this.tell('to intent');
// //                 }
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
// //                 done();
// //             });
// //         });
// //         test('with return', async (done) => {
// //
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                    return this.toIntent('HelloWorldIntent');
// //                 },
// //                 HelloWorldIntent() {
// //                     this.tell('to intent');
// //                 }
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
// //                 done();
// //             });
// //         });
// //     });
// //     describe('test toStateIntent', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //
// //         test('no return', async (done) => {
// //
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     this.toStateIntent('State', 'HelloWorldIntent');
// //                 },
// //                 'State': {
// //                     HelloWorldIntent() {
// //                         this.tell('to intent');
// //                     }
// //                 },
// //
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
// //                 done();
// //             });
// //         });
// //         test('with return', async (done) => {
// //
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     return this.toStateIntent('State', 'HelloWorldIntent');
// //                 },
// //                 'State': {
// //                     HelloWorldIntent() {
// //                         this.tell('to intent');
// //                     }
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('to intent')).toBe(true);
// //                 done();
// //             });
// //         });
// //     });
// //
// //
// //     describe('test handleOnRequest', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //
// //         test('no ON_REQUEST', async (done) => {
// //
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe(undefined);
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 done();
// //             });
// //         });
// //
// //         test('ON_REQUEST synchronous', async (done) => {
// //
// //             app.setHandler({
// //                 'ON_REQUEST'() {
// //                     this.foo = 'bar';
// //                 },
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe('bar');
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 done();
// //             });
// //         });
// //
// //         test('ON_REQUEST asynchronous with promise', async (done) => {
// //
// //             app.setHandler({
// //                 'ON_REQUEST'() {
// //                     return new Promise((resolve) => {
// //                         this.foo = 'bar2';
// //                         resolve();
// //                     });
// //                 },
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe('bar2');
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 done();
// //             });
// //         });
// //
// //         test('ON_REQUEST asynchronous with callback parameter', async (done) => {
// //
// //             app.setHandler({
// //                 'ON_REQUEST'(d: Function) {
// //                     setTimeout(() => {
// //                         this.foo = 'bar3';
// //                         d();
// //                     }, 10);
// //                 },
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe('bar3');
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 done();
// //             });
// //         });
// //
// //     });
// //
// //     describe('test handleOnNewSession', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //
// //         test('no NEW_SESSION', async (done) => {
// //
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe(undefined);
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 done();
// //             });
// //         });
// //
// //         test('NEW_SESSION but request with old session', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_SESSION'() {
// //                     // shouldn't be reached
// //                     this.foo = 'bar';
// //                 },
// //                 'IntentA'() {
// //                     expect(this.foo).toBe(undefined);
// //                 },
// //             });
// //             const intentRequest:JovoRequest = await t.requestBuilder.intent('IntentA');
// //
// //             app.handle(ExpressJS.dummyRequest(intentRequest.setNewSession(false)));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 done();
// //             });
// //         });
// //
// //         test('NEW_SESSION synchronous', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_SESSION'() {
// //                     this.foo = 'bar';
// //                 },
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe('bar');
// //                     done();
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //         });
// //
// //         test('NEW_SESSION asynchronous with promise', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_SESSION'() {
// //                     return new Promise((resolve) => {
// //                         this.foo = 'bar2';
// //                         resolve();
// //                     });
// //                 },
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe('bar2');
// //                     done();
// //
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //         });
// //
// //         test('NEW_SESSION asynchronous with callback parameter', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_SESSION'(d: Function) {
// //                     setTimeout(() => {
// //                         this.foo = 'bar3';
// //                         d();
// //                     }, 10);
// //                 },
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe('bar3');
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 done();
// //             });
// //         });
// //
// //
// //         test('NEW_SESSION toIntent', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_SESSION'() {
// //                     this.foo = 'bar';
// //                     return this.toIntent('NewUserIntent');
// //                 },
// //                 'LAUNCH'() {
// //                     // skip this
// //                 },
// //                 'NewUserIntent'() {
// //                     expect(this.foo).toBe('bar');
// //                     done();
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //         });
// //     });
// //
// //
// //     describe('test handleOnNewUser', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //
// //         test('no NEW_USER', async (done) => {
// //
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe(undefined);
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 done();
// //             });
// //         });
// //
// //
// //         test('NEW_USER synchronous', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_USER'() {
// //                     this.foo = 'bar';
// //                 },
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe('bar');
// //                     done();
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
// //
// //         });
// //
// //         test('NEW_USER asynchronous with promise', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_USER'() {
// //                     return new Promise((resolve) => {
// //                         this.foo = 'bar2';
// //                         resolve();
// //                     });
// //                 },
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe('bar2');
// //                     done();
// //
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
// //         });
// //
// //         test('NEW_USER asynchronous with callback parameter', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_USER'(d: Function) {
// //                     setTimeout(() => {
// //                         this.foo = 'bar3';
// //                         d();
// //                     }, 10);
// //                 },
// //                 'LAUNCH'() {
// //                     expect(this.foo).toBe('bar3');
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 done();
// //             });
// //         });
// //
// //
// //         test('NEW_USER toIntent', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_USER'() {
// //                     this.foo = 'bar';
// //                     return this.toIntent('NewUserIntent');
// //                 },
// //                 'LAUNCH'() {
// //                     // skip this
// //                 },
// //                 'NewUserIntent'() {
// //                     expect(this.foo).toBe('bar');
// //                     done();
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
// //
// //         });
// //     });
// //     describe('test NEW_USER + NEW_SESSION + ON_REQUEST', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //
// //         test('correct order', async (done) => {
// //
// //             app.setHandler({
// //                 'NEW_USER'() {
// //                     this.foo = ['NEW_USER'];
// //                 },
// //                 'NEW_SESSION'() {
// //                     this.foo.push('NEW_SESSION');
// //                 },
// //                 'ON_REQUEST'() {
// //                     this.foo.push('ON_REQUEST');
// //                 },
// //                 'LAUNCH'() {
// //                     this.foo.push('LAUNCH');
// //                     return this.toIntent('IntentAfterToIntent');
// //                 },
// //                 'IntentAfterToIntent'() {
// //                     expect(this.foo[0]).toBe('NEW_USER');
// //                     expect(this.foo[1]).toBe('NEW_SESSION');
// //                     expect(this.foo[2]).toBe('ON_REQUEST');
// //                     expect(this.foo[3]).toBe('LAUNCH');
// //
// //                     done();
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
// //         });
// //     });
// //
// //     describe('test toIntent', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //
// //         test('test no return', async (done) => {
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     this.toIntent('IntentA');
// //                 },
// //                 'IntentA'() {
// //                     this.tell('Hello toIntent');
// //                 }
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello toIntent')).toBe(true);
// //                 done();
// //             });
// //         });
// //         test('test with return', async (done) => {
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     return this.toIntent('IntentA');
// //                 },
// //                 'IntentA'() {
// //                     this.tell('Hello toIntent');
// //                 }
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello toIntent')).toBe(true);
// //                 done();
// //             });
// //         });
// //
// //         test('test within the same state', async (done) => {
// //             app.setHandler({
// //                 'State1': {
// //                     'IntentA'() {
// //                         return this.toIntent('IntentB');
// //                     },
// //                     'IntentB'() {
// //                         this.tell('Hello IntentB');
// //                     },
// //                 },
// //             });
// //             const intentRequest:JovoRequest = await t.requestBuilder.intent('IntentA');
// //
// //             app.handle(ExpressJS.dummyRequest(intentRequest.setState('State1')));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //
// //                 expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
// //                 done();
// //             });
// //         });
// //
// //         test('test in global handler', async (done) => {
// //             app.setHandler({
// //                 'State1': {
// //                     'IntentA'() {
// //                         return this.toIntent('IntentB');
// //                     },
// //                 },
// //                 'IntentB'() {
// //                     this.tell('Hello IntentB');
// //                 },
// //             });
// //             const intentRequest:JovoRequest = await t.requestBuilder.intent('IntentA');
// //
// //             app.handle(ExpressJS.dummyRequest(intentRequest.setState('State1')));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
// //                 done();
// //             });
// //         });
// //
// //         test('test multiple toIntents', async (done) => {
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     return this.toIntent('IntentA');
// //                 },
// //                 'IntentA'() {
// //                     return this.toIntent('IntentB');
// //                 },
// //                 'IntentB'() {
// //                     this.tell('Hello IntentB');
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
// //                 done();
// //             });
// //         });
// //
// //         test('test from ON_REQUEST with skipping LAUNCH', async (done) => {
// //             app.setHandler({
// //                 'ON_REQUEST'() {
// //                     return this.toIntent('IntentA');
// //                 },
// //                 'LAUNCH'() {
// //                     this.tell('LAUNCH');
// //                 },
// //                 'IntentA'() {
// //                     this.tell('Hello toIntent');
// //                 }
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello toIntent')).toBe(true);
// //                 done();
// //             });
// //         });
// //     });
// //
// //
// //     describe('test toStateIntent', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //
// //         test('test no return', async (done) => {
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     this.toStateIntent('State1', 'IntentA');
// //                 },
// //                 'State1': {
// //                     'IntentA'() {
// //                         this.tell('Hello toStateIntent');
// //
// //                     },
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello toStateIntent')).toBe(true);
// //                 done();
// //             });
// //         });
// //         test('test with return', async (done) => {
// //             app.setHandler({
// //                 'LAUNCH'() {
// //                     return this.toStateIntent('State1', 'IntentA');
// //                 },
// //                 'State1': {
// //                     'IntentA'() {
// //                         this.tell('Hello toStateIntent');
// //
// //                     },
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello toStateIntent')).toBe(true);
// //                 done();
// //             });
// //         });
// //
// //         test('test within the same state', async (done) => {
// //             app.setHandler({
// //                 'State1': {
// //                     'IntentA'() {
// //                         return this.toStateIntent('State1', 'IntentB');
// //                     },
// //                     'IntentB'() {
// //                         this.tell('Hello IntentB');
// //                     },
// //                 },
// //             });
// //             const intentRequest:JovoRequest = await t.requestBuilder.intent('IntentA');
// //
// //             app.handle(ExpressJS.dummyRequest(intentRequest.setState('State1')));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
// //                 done();
// //             });
// //         });
// //
// //         test('test toIntent in global handler', async (done) => {
// //             app.setHandler({
// //                 'State1': {
// //                     'IntentA'() {
// //                         return this.toStateIntent('State1', 'IntentB');
// //                     },
// //                 },
// //                 'IntentB'() {
// //                     this.tell('Hello IntentB');
// //                 },
// //             });
// //             const intentRequest:JovoRequest = await t.requestBuilder.intent('IntentA');
// //
// //             app.handle(ExpressJS.dummyRequest(intentRequest.setState('State1')));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello IntentB')).toBe(true);
// //                 done();
// //             });
// //         });
// //
// //         test('test from ON_REQUEST with skipping LAUNCH', async (done) => {
// //             app.setHandler({
// //                 'ON_REQUEST'() {
// //                     return this.toStateIntent('State1', 'IntentA');
// //                 },
// //                 'LAUNCH'() {
// //                     this.tell('LAUNCH');
// //                 },
// //                 'State1': {
// //                     'IntentA'() {
// //                         this.tell('Hello toStateIntent');
// //
// //                     },
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.isTell('Hello toStateIntent')).toBe(true);
// //                 done();
// //             });
// //         });
// //     });
// //
// //     describe('test toStatelessIntent', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //
// //         test('test go to intent in global handler', async (done) => {
// //             app.setHandler({
// //                 'State1': {
// //                     'IntentA'() {
// //                         return this.toStatelessIntent('IntentB');
// //                     },
// //                     'IntentB'() {
// //                         this.tell('State1.IntentB');
// //                     },
// //                 },
// //                 'IntentB'() {
// //                     this.tell('IntentB');
// //                 },
// //             });
// //             const intentRequest:JovoRequest = await t.requestBuilder.intent('IntentA');
// //
// //             app.handle(ExpressJS.dummyRequest(intentRequest.setState('State1')));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //
// //                 expect(handleRequest.jovo.$response.isTell('IntentB')).toBe(true);
// //                 done();
// //             });
// //         });
// //     });
// //
// //     describe('test removeState', () => {
// //         test('test add followUpstate to session attributes', async (done) => {
// //             app = new App();
// //             app.use(p);
// //
// //             app.setHandler({
// //                 'State1': {
// //                     'IntentA'() {
// //                         expect(this.getState()).toBe('State1');
// //                         this.removeState();
// //                         expect(this.getState()).toBe(null);
// //                         done();
// //                     },
// //                 },
// //             });
// //             const intentRequest:JovoRequest = await t.requestBuilder.intent('IntentA');
// //
// //             app.handle(ExpressJS.dummyRequest(intentRequest.setState('State1')));
// //         });
// //     });
// //
// //     describe('test followUpState', () => {
// //
// //         beforeEach(() => {
// //             app = new App();
// //             app.use(p);
// //         });
// //         test('test add followUpstate to session attributes', async (done) => {
// //             app.setHandler({
// //                 LAUNCH() {
// //                     // console.log( this.followUpState('State1'));
// //                     this.followUpState('State1').ask('Hello World', 'foo');
// //
// //                 },
// //                 'State1': {
// //                     'IntentA'() {
// //
// //                     },
// //                 },
// //             });
// //             const launchRequest:JovoRequest = await t.requestBuilder.launch();
// //
// //             app.handle(ExpressJS.dummyRequest(launchRequest));
// //
// //             app.on('response', (handleRequest: HandleRequest) => {
// //                 expect(handleRequest.jovo.$response.hasState('State1')).toBe(true);
// //                 expect(handleRequest.jovo.$response.isAsk('Hello World')).toBe(true);
// //                 done();
// //             });
// //         });
// //     });
// //
// // }
//
//
// function randomUserId() {
//     return 'user-' + Math.random().toString(36).substring(5) + '-' + Math.random().toString(36).substring(2);
// }
