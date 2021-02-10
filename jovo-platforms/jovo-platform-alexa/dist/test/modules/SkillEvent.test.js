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
describe('test Skill events', () => {
    test('test AlexaSkillEvent.SkillDisabled', async (done) => {
        app.setHandler({
            ON_EVENT: {
                'AlexaSkillEvent.SkillDisabled'() {
                    done();
                },
            },
        });
        const audioPlayerRequest = await t.requestBuilder.rawRequestByKey('AlexaSkillEvent.SkillDisabled');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(audioPlayerRequest));
    });
    test('test AlexaSkillEvent.SkillEnabled', async (done) => {
        app.setHandler({
            ON_EVENT: {
                'AlexaSkillEvent.SkillEnabled'() {
                    done();
                },
            },
        });
        const audioPlayerRequest = await t.requestBuilder.rawRequestByKey('AlexaSkillEvent.SkillDisabled');
        _set(audioPlayerRequest, 'request.type', 'AlexaSkillEvent.SkillEnabled');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(audioPlayerRequest));
    });
});
//# sourceMappingURL=SkillEvent.test.js.map