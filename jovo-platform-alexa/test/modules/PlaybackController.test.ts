import {HandleRequest, JovoRequest, TestSuite, SessionConstants} from "jovo-core";
import {App, ExpressJS} from "jovo-framework";
import {Alexa} from "../../src";
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
describe('test PlaybackController events', () => {
    test('test PlaybackController.PlayCommandIssued', async (done) => {
        app.setHandler({
            PLAYBACKCONTROLLER: {
                PlayCommandIssued() {
                    done();
                }
            }
        });

        const audioPlayerRequest:JovoRequest = await t.requestBuilder.rawRequestByKey('PlaybackController.PlayCommandIssued');

        app.handle(ExpressJS.dummyRequest(audioPlayerRequest));

    });

    test('test PlaybackController.NextCommandIssued', async (done) => {
        app.setHandler({
            PLAYBACKCONTROLLER: {
                NextCommandIssued() {
                    done();
                }
            }
        });

        const audioPlayerRequest:JovoRequest = await t.requestBuilder.rawRequestByKey('PlaybackController.PlayCommandIssued');
        _set(audioPlayerRequest, 'request.type', 'PlaybackController.NextCommandIssued');

        app.handle(ExpressJS.dummyRequest(audioPlayerRequest));

    });
    test('test PlaybackController.PreviousCommandIssued', async (done) => {
        app.setHandler({
            PLAYBACKCONTROLLER: {
                PreviousCommandIssued() {
                    done();
                }
            }
        });

        const audioPlayerRequest:JovoRequest = await t.requestBuilder.rawRequestByKey('PlaybackController.PlayCommandIssued');
        _set(audioPlayerRequest, 'request.type', 'PlaybackController.PreviousCommandIssued');

        app.handle(ExpressJS.dummyRequest(audioPlayerRequest));

    });
});
