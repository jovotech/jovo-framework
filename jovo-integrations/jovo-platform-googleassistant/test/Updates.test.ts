import {HandleRequest, JovoRequest, TestSuite} from "jovo-core";
import {App, ExpressJS} from "jovo-framework";
import {GoogleAssistant} from "../src";
import {DialogflowResponse} from "jovo-platform-dialogflow";
import {GoogleActionResponse} from "../src/core/GoogleActionResponse";
import _get = require('lodash.get');


process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;

beforeEach(() => {
    app = new App();
    const ga = new GoogleAssistant();
    app.use(ga);
    t = ga.makeTestSuite();
});

describe('test register updates', () => {

    test('test askForRegisterUpdate', async (done) => {

        app.setHandler({
            LAUNCH() {
                this.$googleAction!.$updates!.askForRegisterUpdate('DummyIntent');
                done();
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.launch();
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('response', (handleRequest: HandleRequest) => {
            const dialogflowResponse = handleRequest.jovo!.$response as DialogflowResponse;

            const googleActionResponse = dialogflowResponse.getPlatformResponse() as GoogleActionResponse;

            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual(
                 {
                  'intent': 'actions.intent.REGISTER_UPDATE',
                  'inputValueData': {
                    '@type': 'type.googleapis.com/google.actions.v2.RegisterUpdateValueSpec',
                    'intent': 'DummyIntent',
                    'triggerContext': {
                      'timeContext': {
                        'frequency': 'DAILY',
                      },
                    },
                  },
                },
            );

            expect(_get(googleActionResponse, 'inputPrompt')).toEqual(
                {
                    "initialPrompts": [
                        {
                            "textToSpeech": "PLACEHOLDER_FOR_REGISTER_UPDATE"
                        }
                    ],
                    "noInputPrompts": []
                },
            );
            done();
        });
    }, 250);



    test('test correct type', async (done) => {

        app.setHandler({
            ON_REGISTER_UPDATE() {
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('RegisterUpdateCancelled');
        app.handle(ExpressJS.dummyRequest(launchRequest));

        app.on('after.router', (handleRequest: HandleRequest) => {
            expect(handleRequest.jovo!.$type.type).toBe('ON_REGISTER_UPDATE');
            done();
        });
    }, 250);


    test('test correct isRegisterUpdateCancelled', async (done) => {
        app.setHandler({
            ON_REGISTER_UPDATE() {
                expect(this.$googleAction!.$updates!.isRegisterUpdateCancelled()).toBe(true);
                expect(this.$googleAction!.$updates!.getRegisterUpdateStatus()).toBe('CANCELLED');
                done();
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('RegisterUpdateCancelled');
        app.handle(ExpressJS.dummyRequest(launchRequest));
    }, 250);


    test('test correct isSignInOk', async (done) => {
        app.setHandler({
            ON_REGISTER_UPDATE() {
                expect(this.$googleAction!.$updates!.isRegisterUpdateOk()).toBe(true);
                expect(this.$googleAction!.$updates!.getRegisterUpdateStatus()).toBe('OK');
                done();
            },
        });

        const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('RegisterUpdateOk');
        app.handle(ExpressJS.dummyRequest(launchRequest));
    }, 250);
});
