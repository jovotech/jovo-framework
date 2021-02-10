"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../../src");
const _set = require("lodash.set");
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(550);
const delay = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
};
beforeEach(() => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
});
describe('test PlaybackController events', () => {
    test('test PlaybackController.PlayCommandIssued', async (done) => {
        app.setHandler({
            PLAYBACKCONTROLLER: {
                PlayCommandIssued() {
                    done();
                },
            },
        });
        const audioPlayerRequest = await t.requestBuilder.rawRequestByKey('PlaybackController.PlayCommandIssued');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(audioPlayerRequest));
    });
    test('test PlaybackController.NextCommandIssued', async (done) => {
        app.setHandler({
            PLAYBACKCONTROLLER: {
                NextCommandIssued() {
                    done();
                },
            },
        });
        const audioPlayerRequest = await t.requestBuilder.rawRequestByKey('PlaybackController.PlayCommandIssued');
        _set(audioPlayerRequest, 'request.type', 'PlaybackController.NextCommandIssued');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(audioPlayerRequest));
    });
    test('test PlaybackController.PreviousCommandIssued', async (done) => {
        app.setHandler({
            PLAYBACKCONTROLLER: {
                PreviousCommandIssued() {
                    done();
                },
            },
        });
        const audioPlayerRequest = await t.requestBuilder.rawRequestByKey('PlaybackController.PlayCommandIssued');
        _set(audioPlayerRequest, 'request.type', 'PlaybackController.PreviousCommandIssued');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(audioPlayerRequest));
    });
});
//# sourceMappingURL=PlaybackController.test.js.map