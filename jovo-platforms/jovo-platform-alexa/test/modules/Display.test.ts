import {HandleRequest, JovoRequest, TestSuite, SessionConstants} from "jovo-core";
import {App, ExpressJS} from "jovo-framework";
import {Alexa, AlexaRequest} from "../../src";
import _get = require('lodash.get');

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

describe('test Display functions', () => {

    test('test showVideo', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.setSessionAttribute('myKey', 'myValue');
                this.$alexaSkill!.showVideo('https://url.to.video', 'titleABC');
            },
        });

        const launchRequest:JovoRequest = await t.requestBuilder.launch();

        (launchRequest as AlexaRequest).setVideoInterface();

        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('response', (handleRequest: HandleRequest) => {

            const response = handleRequest.jovo!.$response;
            expect(_get(response, 'response.directives[0].type')).toEqual('VideoApp.Launch');
            expect(_get(response, 'response.shouldEndSession')).toBeUndefined();

            expect(_get(response, 'response.directives[0].videoItem.source')).toEqual('https://url.to.video');
            expect(_get(response, 'response.directives[0].videoItem.metadata.title')).toEqual('titleABC');

            // verify that session attributes are returned in response
            expect(_get(response, 'sessionAttributes')).toStrictEqual({
                myKey: 'myValue'
            });

            done();
        });
    });


    test('test ON_ELEMENT_SELECTED with nested token as function', async (done) => {
        app.setHandler({
            ON_ELEMENT_SELECTED: {
                token() {
                    done();

                }
            },
        });

        const request:JovoRequest = await t.requestBuilder.rawRequestByKey('Display.ElementSelected');

        app.handle(ExpressJS.dummyRequest(request));

    });
    test('test ON_ELEMENT_SELECTED', async (done) => {
        app.setHandler({
            ON_ELEMENT_SELECTED() {
                done();
            },
        });

        const request:JovoRequest = await t.requestBuilder.rawRequestByKey('Display.ElementSelected');

        app.handle(ExpressJS.dummyRequest(request));

    });
});
