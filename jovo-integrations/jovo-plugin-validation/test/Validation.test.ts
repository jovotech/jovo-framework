import { HandleRequest, JovoRequest, BaseApp } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { IsRequiredValidator, Validation } from '../src';


describe('IsRequiredValidator', () => {
    test('should fail if required parameter is not present', async (done) => {
        const mockHR: HandleRequest = {
            app: new BaseApp(),
            host: {
                hasWriteFileAccess: true,
                headers: {},
                $request: {},
                getRequestObject() { },
                setResponse() {
                    return new Promise((res, rej) => { });
                },
                fail() { }
            },
            // @ts-ignore
            jovo: {
                $request: {
                    getIntentName() {
                        return 'ExampleIntent';
                    },

                    toIntent() {
                        console.log('hello my friend');
                    },

                    $inputs: { 
                        
                    }
                }
            }
        }

        const validation = new Validation({
            validation: {
                ExampleIntent: {
                    input: new IsRequiredValidator()
                }
            }
        });

        validation.run(mockHR);

        const t = p.makeTestSuite();
        const launchRequest: JovoRequest = await t.requestBuilder.intent('ExampleIntent');
        app.handle(ExpressJS.dummyRequest(launchRequest));
    });
    test('should succeed if required parameter is present', async (done) => {
        const app = new App({
            validation: {
                ExampleIntent: {
                    input: new IsRequiredValidator()
                }
            }
        });

        app.use(p, new Validation());
        app.setHandler({
            ExampleIntent() {
                done();
            }
        });

        const t = p.makeTestSuite();
        const launchRequest: JovoRequest = await t.requestBuilder.intent('ExampleIntent', { input: 'test' });
        app.handle(ExpressJS.dummyRequest(launchRequest));
    })
});

    // describe('ValidValuesValidator', () => {
    //     test('should fail if input has an invalid value');
    //     test('should succeed if input has a valid value');
    // });

    // describe('InvalidValuesValidator', () => {
    //     test('should fail if input has an invalid value');
    //     test('should succeed if input has a valid value');
    // });

    // describe('Validation.constructor()', () => {

    // });

    // describe('Validation.install()', () => {

    // });
