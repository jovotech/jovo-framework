"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../../src");
const _get = require("lodash.get");
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
describe('test GameEngine functions', () => {
    test('test respond', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.setSessionAttribute('myKey', 'myValue');
                this.$alexaSkill.$gameEngine.respond('hello');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const response = handleRequest.jovo.$response;
            expect(_get(response, 'response.outputSpeech')).toStrictEqual({
                type: 'SSML',
                ssml: '<speak>hello</speak>',
            });
            expect(_get(response, 'response.shouldEndSession')).toBeUndefined();
            // verify that session attributes are returned in response
            expect(_get(response, 'sessionAttributes')).toStrictEqual({
                myKey: 'myValue',
            });
            done();
        });
    });
});
//# sourceMappingURL=GameEngine.test.js.map