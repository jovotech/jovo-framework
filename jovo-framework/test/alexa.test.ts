test('dummy test', () => {
    expect(true).toBe(true);
});

import { App } from '../src/App';
import {ExpressJS} from "../src";
import {JovoRequest, TestSuite, Jovo, SpeechBuilder, HandleRequest} from "jovo-core";
process.env.NODE_ENV = 'TEST';
//
// const alexa = new Alexa();
// const t = alexa.makeTestSuite();
//
// let app: App;
//
//
//
//
// describe('test Requests', () => {
//     beforeEach(() => {
//         app = new App();
//         app.use(alexa);
//     });
//
//     test('test LaunchRequest', async(done) => {
//         app.setHandler({
//             LAUNCH() {
//             },
//         });
//         const launchRequest:JovoRequest = await t.requestBuilder.launch();
//
//         app.handle(ExpressJS.dummyRequest(launchRequest));
//
//         app.on('response', (handleRequest: HandleRequest) => {
//             expect(handleRequest.jovo.$response.isTell('Hello World')).toBe(true);
//             done();
//         });
//
//     }, 500);
//
//
//     test('test IntentRequest', async(done) => {
//         app.setHandler({
//             'IntentA'() {
//                 this.tell('Hello World');
//             }
//         });
//         const request:JovoRequest = await t.requestBuilder.intent('IntentA');
//
//         app.handle(ExpressJS.dummyRequest(request));
//
//         app.on('response', (handleRequest: HandleRequest) => {
//             expect(handleRequest.jovo.$response.isTell('Hello World')).toBe(true);
//             done();
//         });
//
//     }, 500);
//
//
//     test('test intentMapping', async(done) => {
//         app.config.plugins.Router = {
//             intentMap: {
//                 'AMAZON.YesIntent': 'YesIntent',
//             }
//         };
//
//         app.setHandler({
//             'YesIntent'() {
//                 this.tell('YesIntent');
//             }
//         });
//         const intentRequest:JovoRequest = await t.requestBuilder.intent('AMAZON.YesIntent', {});
//
//         app.handle(ExpressJS.dummyRequest(intentRequest));
//         app.on('response', (handleRequest: HandleRequest) => {
//             expect(handleRequest.jovo.$response.isTell('YesIntent')).toBe(true);
//             done();
//         });
//
//     }, 500);
//
//     test('test ON_PURCHASE', async(done) => {
//
//         app.setHandler({
//             'ON_PURCHASE'() {
//                 this.tell('ON_PURCHASE');
//             }
//         });
//         const intentRequest:JovoRequest = await t.requestBuilder.rawRequestByKey('Connections.Response');
//         app.handle(ExpressJS.dummyRequest(intentRequest));
//         app.on('response', (handleRequest: HandleRequest) => {
//             expect(handleRequest.jovo.$response.isTell('ON_PURCHASE')).toBe(true);
//             done();
//         });
//
//     }, 500);
//     test('test AUDIOPLAYER', async(done) => {
//
//         app.setHandler({
//             'AUDIOPLAYER': {
//                 'AlexaSkill.PlaybackStarted'() {
//                 }
//             }
//         });
//         const intentRequest:JovoRequest = await t.requestBuilder.rawRequestByKey('AudioPlayer.PlaybackStarted');
//         app.handle(ExpressJS.dummyRequest(intentRequest));
//         app.on('response', (handleRequest: HandleRequest) => {
//             const alexaResponse = handleRequest.jovo.$response as AlexaResponse;
//             expect(Object.keys(alexaResponse.response).length).toBe(1);
//             expect(alexaResponse.response.shouldEndSession).toBe(true);
//             done();
//         });
//
//     }, 500);
// });
//

