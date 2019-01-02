
import {Router} from './../src/middleware/Router';
import {Config as AppConfig} from "./../src/App";


test('test intentRoute', () => {

    const appConfig: AppConfig = {
        handlers: {
            IntentA() {

            },
            State1: {
                IntentB() {

                },
                IntentC() {

                },

                State2: {
                    IntentC() {

                    }
                },
            },
        }
    };


    const result1 = Router.intentRoute(appConfig, undefined, 'IntentA');
    expect(result1).toHaveProperty('path', 'IntentA');

    // state intent
    const result2 = Router.intentRoute(appConfig, 'State1', 'IntentB');
    expect(result2).toHaveProperty('path', 'State1.IntentB');

    // multiple state intent
    const result3 = Router.intentRoute(appConfig, 'State1.State2', 'IntentC');
    expect(result3).toHaveProperty('path', 'State1.State2.IntentC');

    // multiple state intent
    const result3b = Router.intentRoute(appConfig, 'State1.State2', 'IntentB');
    expect(result3b).toHaveProperty('path', 'State1["IntentB"]');


    // route of global IntentA
    const result4 = Router.intentRoute(appConfig, 'State1', 'IntentA');
    expect(result4).toHaveProperty('path', 'IntentA');


});


test('test intentRoute() unhandled global', () => {
    const appConfig: AppConfig = {
        handlers: {
            State1: {
            },
            Unhandled() {

            },
        }
    };
    const result1 = Router.intentRoute(appConfig, 'State1', 'IntentX');
    expect(result1).toHaveProperty('path', 'Unhandled');
});
test('test intentRoute() unhandled in state', () => {
    const appConfig2: AppConfig = {
        handlers: {
            State1: {
                Unhandled() {

                },
            },
            Unhandled() {

            },
        }
    };
    const result2 = Router.intentRoute(appConfig2, 'State1', 'IntentX');
    expect(result2).toHaveProperty('path', 'State1.Unhandled');
});
test('test intentRoute() unhandled without unhandled in handler ', () => {
    const appConfig3: AppConfig = {
        handlers: {
            State1: {
            },
        }
    };
    const result3 = Router.intentRoute(appConfig3, 'State1', 'IntentX');
    expect(result3).toHaveProperty('path', 'State1.IntentX');
});

test('test intentRoute() intentsToSkipUnhandled ', () => {
    const appConfig3: AppConfig = {
        intentsToSkipUnhandled: ['SkipIntent'],
        handlers: {
            State1: {
                Unhandled() {

                }
            },
            SkipIntent() {

            }

        }
    };
    const result3 = Router.intentRoute(appConfig3, 'State1', 'SkipIntent');
    expect(result3).toHaveProperty('path', 'SkipIntent');
});


test('test intentRoute() Intents with dots', () => {
    const appConfig1: AppConfig = {
        handlers: {
            'AMAZON.StopIntent'() {

            },
            State1: {
                'AMAZON.CancelIntent'() {

                },
                State12: {
                }
            }
        }
    };
    const result1 = Router.intentRoute(appConfig1, undefined, 'AMAZON.StopIntent');
    expect(result1).toHaveProperty('path', '["AMAZON.StopIntent"]');

    const result2 = Router.intentRoute(appConfig1, 'State1', 'AMAZON.CancelIntent');
    expect(result2).toHaveProperty('path', 'State1["AMAZON.CancelIntent"]');

    const result3 = Router.intentRoute(appConfig1, 'State1.State12', 'AMAZON.CancelIntent');
    expect(result3).toHaveProperty('path', 'State1["AMAZON.CancelIntent"]');

});
test('test intentRoute() Intents with dots', () => {
    const appConfig1: AppConfig = {
        intentsToSkipUnhandled: ['IntentB'],
        handlers: {
            IntentA() {

            },
            IntentB() {

            },
            State1: {

                Unhandled() {

                }
            }
        }
    };
    const result1 = Router.intentRoute(appConfig1, 'State1', 'IntentA');
    expect(result1).toHaveProperty('path', 'State1.Unhandled');

    const result2 = Router.intentRoute(appConfig1, 'State1', 'IntentB');
    expect(result2).toHaveProperty('path', 'IntentB');

});


test('test mapIntentName()', () => {
    const appConfig1: AppConfig = {
        intentMap: {
            'AMAZON.StopIntent': 'END',
        },
    };
    const result1 = Router.mapIntentName(appConfig1, 'AMAZON.StopIntent');
    expect(result1).toBe('END');

    const result2 = Router.mapIntentName(appConfig1, 'AMAZON.CancelIntent');
    expect(result2).toBe('AMAZON.CancelIntent');

});
