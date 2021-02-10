"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../src");
const _get = require("lodash.get");
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
beforeEach(() => {
    app = new jovo_framework_1.App();
    const ga = new src_1.GoogleAssistant();
    app.use(ga);
    t = ga.makeTestSuite();
});
describe('test register updates', () => {
    test('test askForRegisterUpdate', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.$updates.askForRegisterUpdate('DummyIntent');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.REGISTER_UPDATE',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.RegisterUpdateValueSpec',
                    'intent': 'DummyIntent',
                    'triggerContext': {
                        timeContext: {
                            frequency: 'DAILY',
                        },
                    },
                },
            });
            expect(_get(googleActionResponse, 'inputPrompt')).toEqual({
                initialPrompts: [
                    {
                        textToSpeech: 'PLACEHOLDER_FOR_REGISTER_UPDATE',
                    },
                ],
                noInputPrompts: [],
            });
            done();
        });
    }, 250);
    test('test correct type', async (done) => {
        app.setHandler({
            ON_REGISTER_UPDATE() { },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('RegisterUpdateCancelled');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('after.router', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe('ON_REGISTER_UPDATE');
            done();
        });
    }, 250);
    test('test correct isRegisterUpdateCancelled', async (done) => {
        app.setHandler({
            ON_REGISTER_UPDATE() {
                expect(this.$googleAction.$updates.isRegisterUpdateCancelled()).toBe(true);
                expect(this.$googleAction.$updates.getRegisterUpdateStatus()).toBe('CANCELLED');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('RegisterUpdateCancelled');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    }, 250);
    test('test correct isSignInOk', async (done) => {
        app.setHandler({
            ON_REGISTER_UPDATE() {
                expect(this.$googleAction.$updates.isRegisterUpdateOk()).toBe(true);
                expect(this.$googleAction.$updates.getRegisterUpdateStatus()).toBe('OK');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('RegisterUpdateOk');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    }, 250);
});
//# sourceMappingURL=Updates.test.js.map