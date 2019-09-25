import {HandleRequest, JovoRequest, TestSuite} from "jovo-core";
import {App, ExpressJS} from "jovo-framework";
import {Alexa} from "../../src";

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);

beforeEach(() => {
    app = new App();
    const alexa = new Alexa();
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
        const request:JovoRequest = await t.requestBuilder.rawRequestByKey('SessionEndedRequest');
        app.handle(ExpressJS.dummyRequest(request));

    });

    test('test System.ExceptionEncountered', async (done) => {
        app.setHandler({
            ON_ERROR() {
                done();
            },
        });
        const request:JovoRequest = await t.requestBuilder.rawRequestByKey('System.ExceptionEncountered');
        app.handle(ExpressJS.dummyRequest(request));
    });

    test('test empty response', async (done) => {
        app.setHandler({
            END() {

            },
        });
        const request:JovoRequest = await t.requestBuilder.end();
        app.handle(ExpressJS.dummyRequest(request));

        app.on('response', (handleRequest: HandleRequest) => {

            const response = handleRequest.jovo!.$response;
            expect(response).toEqual({
                version: '1.0',
                response: { shouldEndSession: true },
                sessionAttributes: {} });
            done();
        });
    });


    test('test deleteShouldEndSession', async (done) => {
        app.setHandler({
            // not a real case, but enough for the test
            END() {
                this.$alexaSkill!.deleteShouldEndSession();
            },
        });
        const request:JovoRequest = await t.requestBuilder.end();
        app.handle(ExpressJS.dummyRequest(request));

        app.on('response', (handleRequest: HandleRequest) => {

            const response = handleRequest.jovo!.$response;
            expect(response).toEqual({
                version: '1.0',
                response: { },
                sessionAttributes: {} });
            done();
        });
    });
});
