import { HandleRequest, JovoRequest, TestSuite, SessionConstants } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { IsRequiredValidator, Validation } from '../src';

process.env.NODE_ENV = 'UNIT_TEST';

for (const platform of [new Alexa(), new GoogleAssistant()]) {
    describe('IsRequiredValidator', () => {
        test('should fail if required parameter is not present', async (done) => {
            const app = new App({
                validation: {
                    ExampleIntent: {
                        input: new IsRequiredValidator('Unhandled')
                    }
                }
            });

            app.use(platform, new Validation());
            app.setHandler({
                ExampleIntent() {

                },
                Unhandled() {
                    done();
                }
            });

            const t = platform.makeTestSuite();
            const launchRequest: JovoRequest = await t.requestBuilder.intent('ExampleIntent');
            app.handle(ExpressJS.dummyRequest(launchRequest));
        });
        test('should succeed if required parameter is present', async (done) => {
            const app = new App({
                validation: {
                    ExampleIntent: {
                        input: new IsRequiredValidator('Unhandled')
                    }
                }
            });

            app.use(platform, new Validation());
            app.setHandler({
                ExampleIntent() {
                    done();
                }
            });

            const t = platform.makeTestSuite();
            const launchRequest: JovoRequest = await t.requestBuilder.intent('ExampleIntent', { input: 'test' });
            app.handle(ExpressJS.dummyRequest(launchRequest));
        })
    });

    describe('ValidValuesValidator', () => {
        test('should fail if input has an invalid value');
        test('should succeed if input has a valid value');
    });

    describe('InvalidValuesValidator', () => {
        test('should fail if input has an invalid value');
        test('should succeed if input has a valid value');
    });

    describe('Validation.constructor()', () => {

    });

    describe('Validation.install()', () => {

    });

    
}
