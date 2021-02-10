"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../../src");
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(550);
beforeEach(() => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
});
describe('test requests', () => {
    test('test SessionEndedRequest', async (done) => {
        app.setHandler({
            END() {
                done();
            },
        });
        const request = await t.requestBuilder.rawRequestByKey('SessionEndedRequest');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test System.ExceptionEncountered', async (done) => {
        app.setHandler({
            ON_ERROR() {
                done();
            },
        });
        const request = await t.requestBuilder.rawRequestByKey('System.ExceptionEncountered');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test empty response', async (done) => {
        app.setHandler({
            END() { },
        });
        const request = await t.requestBuilder.end();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
        app.on('response', (handleRequest) => {
            const response = handleRequest.jovo.$response;
            expect(response).toEqual({
                version: '1.0',
                response: { shouldEndSession: true },
                sessionAttributes: {},
            });
            done();
        });
    });
    test('test deleteShouldEndSession', async (done) => {
        app.setHandler({
            // not a real case, but enough for the test
            END() {
                this.$alexaSkill.deleteShouldEndSession();
            },
        });
        const request = await t.requestBuilder.end();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
        app.on('response', (handleRequest) => {
            const response = handleRequest.jovo.$response;
            expect(response).toEqual({
                version: '1.0',
                response: {},
                sessionAttributes: {},
            });
            done();
        });
    });
});
//# sourceMappingURL=AlexaCore.test.js.map