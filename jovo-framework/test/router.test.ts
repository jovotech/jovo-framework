
import {Router} from './../src/middleware/Router';
import {Config as AppConfig} from "./../src/App";
process.env.NODE_ENV = 'UNIT_TEST';


test('test intentRoute', () => {

    const jovo = {
        $handlers: {
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
    const result1 = Router.intentRoute(jovo.$handlers, undefined, 'IntentA');
    expect(result1).toHaveProperty('path', 'IntentA');

    // state intent
    const result2 = Router.intentRoute(jovo.$handlers, 'State1', 'IntentB');
    expect(result2).toHaveProperty('path', 'State1.IntentB');

    // multiple state intent
    const result3 = Router.intentRoute(jovo.$handlers, 'State1.State2', 'IntentC');
    expect(result3).toHaveProperty('path', 'State1.State2.IntentC');

    // multiple state intent
    const result3b = Router.intentRoute(jovo.$handlers, 'State1.State2', 'IntentB');
    expect(result3b).toHaveProperty('path', 'State1["IntentB"]');


    // route of global IntentA
    const result4 = Router.intentRoute(jovo.$handlers, 'State1', 'IntentA');
    expect(result4).toHaveProperty('path', 'IntentA');


});


test('test intentRoute() unhandled global', () => {
    const jovo = {
        $handlers: {
            State1: {
            },
            Unhandled() {

            },
        }
    };

    const result1 = Router.intentRoute(jovo.$handlers, 'State1', 'IntentX');
    expect(result1).toHaveProperty('path', 'Unhandled');
});
test('test intentRoute() unhandled in state', () => {
    const jovo = {
        $handlers: {
            State1: {
                Unhandled() {

                },
            },
            Unhandled() {

            },
        }
    };

    const result2 = Router.intentRoute(jovo.$handlers, 'State1', 'IntentX');
    expect(result2).toHaveProperty('path', 'State1.Unhandled');
});
test('test intentRoute() unhandled without unhandled in handler ', () => {
    const jovo = {
        $handlers: {
            State1: {
            },
        }
    };

    const result3 = Router.intentRoute(jovo.$handlers, 'State1', 'IntentX');
    expect(result3).toHaveProperty('path', 'State1.IntentX');
});

test('test intentRoute() intentsToSkipUnhandled ', () => {
    const jovo = {
        $handlers: {
            State1: {
                Unhandled() {

                }
            },
            SkipIntent() {

            }
        }
    };
    const result3 = Router.intentRoute(jovo.$handlers, 'State1', 'SkipIntent',  ['SkipIntent']);
    expect(result3).toHaveProperty('path', 'SkipIntent');
});


test('test intentRoute() Intents with dots', () => {
    const jovo = {
        $handlers: {
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

    const result1 = Router.intentRoute(jovo.$handlers, undefined, 'AMAZON.StopIntent');
    expect(result1).toHaveProperty('path', '["AMAZON.StopIntent"]');

    const result2 = Router.intentRoute(jovo.$handlers, 'State1', 'AMAZON.CancelIntent');
    expect(result2).toHaveProperty('path', 'State1["AMAZON.CancelIntent"]');

    const result3 = Router.intentRoute(jovo.$handlers, 'State1.State12', 'AMAZON.CancelIntent');
    expect(result3).toHaveProperty('path', 'State1["AMAZON.CancelIntent"]');

});
test('test intentRoute() Intents with dots', () => {
    const jovo = {
        $handlers: {
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

    const result1 = Router.intentRoute(jovo.$handlers, 'State1', 'IntentA', ['IntentB']);
    expect(result1).toHaveProperty('path', 'State1.Unhandled');

    const result2 = Router.intentRoute(jovo.$handlers, 'State1', 'IntentB', ['IntentB']);
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
