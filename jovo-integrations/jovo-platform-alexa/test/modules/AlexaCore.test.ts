import {HandleRequest, JovoRequest, TestSuite, SessionConstants} from "jovo-core";
import {App, ExpressJS} from "jovo-framework";
import {Alexa} from "./../../src";
import _get = require('lodash.get');
import _set = require('lodash.set');

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);
const delay = (ms: number) => {
    return new Promise(r => setTimeout(r, ms));
};

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

    test('test SessionEndedRequest with nested END', async (done) => {
        app.setHandler({
            END: {
                USER_INITIATED() {
                    done();
                }
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


});
