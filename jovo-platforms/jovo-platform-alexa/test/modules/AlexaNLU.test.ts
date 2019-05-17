import {JovoRequest, TestSuite} from "jovo-core";
import {App, ExpressJS} from "jovo-framework";
import {Alexa} from "../../src";
import _get = require('lodash.get');
import {AlexaInput} from "../../src/core/AlexaRequest";

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

describe(`test internal 'nlu'`, () => {
    test('test intent no slots', async (done) => {
        app.setHandler({
            HelpIntent() {
                expect(this.$nlu!.intent!.name).toEqual('HelpIntent');
                expect(Object.keys(this.$inputs).length).toEqual(0);
                done();
            },
        });
        const request:JovoRequest = await t.requestBuilder.rawRequestByKey('IntentRequest1');
        app.handle(ExpressJS.dummyRequest(request));
    });

    test('test intent with slot', async (done) => {
        app.setHandler({
            NameState: {
                MyNameIsIntent() {
                    expect(this.$nlu!.intent!.name).toEqual('MyNameIsIntent');
                    expect(this.$inputs.name.name).toEqual('name');
                    expect(this.$inputs.name.key!.toLowerCase()).toEqual('jeff');
                    expect(this.$inputs.name.value!.toLowerCase()).toEqual('jeff');
                    expect((this.$inputs.name as AlexaInput).alexaSkill.name)
                        .toEqual('name');
                    expect((this.$inputs.name as AlexaInput).alexaSkill.value!.toLowerCase())
                        .toEqual('jeff');
                    expect((this.$inputs.name as AlexaInput).alexaSkill.confirmationStatus)
                        .toEqual('NONE');
                    expect((this.$inputs.name as AlexaInput).alexaSkill.source)
                        .toEqual('USER');
                    done();
                },
            }
        });
        const request:JovoRequest = await t.requestBuilder.rawRequestByKey('IntentRequestWithSlot');
        app.handle(ExpressJS.dummyRequest(request));
    });

    test('test intent with slot resolution', async (done) => {
        app.setHandler({
            NameState: {
                MyNameIsIntent() {
                    expect(this.$nlu!.intent!.name).toEqual('MyNameIsIntent');
                    expect(this.$inputs.name.name).toEqual('name');
                    expect(this.$inputs.name.id!.toLowerCase()).toEqual('jeffid');

                    expect(this.$inputs.name.key!.toLowerCase()).toEqual('jeff');
                    expect(this.$inputs.name.value!.toLowerCase()).toEqual('jeff');
                    expect((this.$inputs.name as AlexaInput).alexaSkill.name)
                        .toEqual('name');
                    expect((this.$inputs.name as AlexaInput).alexaSkill.value!.toLowerCase())
                        .toEqual('jeff');
                    expect((this.$inputs.name as AlexaInput).alexaSkill.confirmationStatus)
                        .toEqual('NONE');
                    expect((this.$inputs.name as AlexaInput).alexaSkill.source)
                        .toEqual('USER');

                    expect(_get((this.$inputs.name as AlexaInput).alexaSkill,
                        'resolutions.resolutionsPerAuthority[0].status.code'))
                        .toEqual('ER_SUCCESS_MATCH');

                    expect(_get((this.$inputs.name as AlexaInput).alexaSkill,
                        'resolutions.resolutionsPerAuthority[0].values[0].value.name').toLowerCase())
                        .toEqual('jeff');

                    expect(_get((this.$inputs.name as AlexaInput).alexaSkill,
                        'resolutions.resolutionsPerAuthority[0].values[0].value.id').toLowerCase())
                        .toEqual('jeffid');
                    done();
                },
            }
        });
        const request:JovoRequest = await t.requestBuilder.rawRequestByKey('IntentRequestWithSlotResolution');
        app.handle(ExpressJS.dummyRequest(request));
    });
});
