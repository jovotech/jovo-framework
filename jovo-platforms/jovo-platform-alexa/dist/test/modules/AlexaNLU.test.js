"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../../src");
const _get = require("lodash.get");
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
describe(`test internal 'nlu'`, () => {
    test('test intent no slots', async (done) => {
        app.setHandler({
            HelpIntent() {
                expect(this.$nlu.intent.name).toEqual('HelpIntent');
                expect(Object.keys(this.$inputs).length).toEqual(0);
                done();
            },
        });
        const request = await t.requestBuilder.rawRequestByKey('IntentRequest1');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test intent with slot', async (done) => {
        app.setHandler({
            NameState: {
                MyNameIsIntent() {
                    expect(this.$nlu.intent.name).toEqual('MyNameIsIntent');
                    expect(this.$inputs.name.name).toEqual('name');
                    expect(this.$inputs.name.key.toLowerCase()).toEqual('jeff');
                    expect(this.$inputs.name.value.toLowerCase()).toEqual('jeff');
                    expect(this.$inputs.name.alexaSkill.name).toEqual('name');
                    expect(this.$inputs.name.alexaSkill.value.toLowerCase()).toEqual('jeff');
                    expect(this.$inputs.name.alexaSkill.confirmationStatus).toEqual('NONE');
                    expect(this.$inputs.name.alexaSkill.source).toEqual('USER');
                    done();
                },
            },
        });
        const request = await t.requestBuilder.rawRequestByKey('IntentRequestWithSlot');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test intent with slot resolution', async (done) => {
        app.setHandler({
            NameState: {
                MyNameIsIntent() {
                    expect(this.$nlu.intent.name).toEqual('MyNameIsIntent');
                    expect(this.$inputs.name.name).toEqual('name');
                    expect(this.$inputs.name.id.toLowerCase()).toEqual('jeffid');
                    expect(this.$inputs.name.key.toLowerCase()).toEqual('jeff');
                    expect(this.$inputs.name.value.toLowerCase()).toEqual('jeff');
                    expect(this.$inputs.name.alexaSkill.name).toEqual('name');
                    expect(this.$inputs.name.alexaSkill.value.toLowerCase()).toEqual('jeff');
                    expect(this.$inputs.name.alexaSkill.confirmationStatus).toEqual('NONE');
                    expect(this.$inputs.name.alexaSkill.source).toEqual('USER');
                    expect(_get(this.$inputs.name.alexaSkill, 'resolutions.resolutionsPerAuthority[0].status.code')).toEqual('ER_SUCCESS_MATCH');
                    expect(_get(this.$inputs.name.alexaSkill, 'resolutions.resolutionsPerAuthority[0].values[0].value.name').toLowerCase()).toEqual('jeff');
                    expect(_get(this.$inputs.name.alexaSkill, 'resolutions.resolutionsPerAuthority[0].values[0].value.id').toLowerCase()).toEqual('jeffid');
                    done();
                },
            },
        });
        const request = await t.requestBuilder.rawRequestByKey('IntentRequestWithSlotResolution');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
});
//# sourceMappingURL=AlexaNLU.test.js.map