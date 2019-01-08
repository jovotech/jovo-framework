
import {Handler} from './../src/middleware/Handler';
import {App, Config as AppConfig} from './../src/App';
import {EnumRequestType, HandleRequest, Jovo, JovoRequest} from "jovo-core";
require('source-map-support').install();
process.env.NODE_ENV = 'TEST';
let app: App;
jest.setTimeout(250);


test('test setHandler with single handler', () => {
    app = new App();
    app.setHandler({
        LAUNCH() {

        },
        State: {
            Intent() {

            },
        },
    });
    expect((app.config as AppConfig).handlers.LAUNCH).toBeDefined();
    expect((app.config as AppConfig).handlers.State).toBeDefined();

});

test('test setHandler with multiple handlers', () => {
    app = new App();
    app.setHandler({
        State: {
            Intent() {

            },
        },
    }, {
        State2: {
            Intent() {

            },
        },
    });
    expect((app.config as AppConfig).handlers.State).toBeDefined();
    expect((app.config as AppConfig).handlers.State2).toBeDefined();

});

test('test throw exception on non existing route', (done) => {
    const appConfig: AppConfig = {
        handlers: {
            IntentA() {

            },
            Unhandled() {
                console.log('unhandled');
            },
        }
    };

    // @ts-ignore
    Handler.applyHandle(null, {
        path: 'NonExistingPath',
        type: EnumRequestType.INTENT,
    }, appConfig).catch((e: Error) => {
        expect(e.message).toBe('Could not find the route "NonExistingPath" in your handler function.');
        done();
    });
});

test('test skip exception on non existing route', async (done) => {
    const appConfig: AppConfig = {
        handlers: {
            ON_REQUEST() {

            },
            IntentA() {

            },
            Unhandled() {
                console.log('unhandled');
            },
        }
    };

    // @ts-ignore
    await Handler.applyHandle(null, {
        path: 'NonExistingPath',
        type: EnumRequestType.INTENT,
    }, appConfig);

    done();
});

test('test applyHandle on route that returns rejected promise', async () => {
    const rejectionReason = 'rejection reason';

    expect.assertions(1);

    const appConfig: AppConfig = {
        handlers: {
            IntentA() {
                return Promise.reject(rejectionReason);
            }
        }
    };

    try {
        // @ts-ignore
        await Handler.applyHandle(null, {
            path: 'IntentA',
            type: EnumRequestType.INTENT,
        }, appConfig);
    } catch (e) {
        expect(e).toEqual(rejectionReason);
    }
});


test('test handleOnPromise on route that returns rejected promise', async () => {
    const rejectionReason = 'rejection reason';

    expect.assertions(1);

    const appConfig: AppConfig = {
        handlers: {
            ON_REQUEST() {
                return Promise.reject(rejectionReason);
            }
        }
    };

    try {
        const jovo: any = {}; // tslint:disable-line
        // @ts-ignore
        await Handler.handleOnPromise(jovo, appConfig.handlers.ON_REQUEST);
    } catch (e) {
        expect(e).toEqual(rejectionReason);
    }
});


test('test applyHandle on route that immediately throws exception', async () => {
    const errorMessage = 'an error';

    expect.assertions(1);

    const appConfig: AppConfig = {
        handlers: {
            IntentA() {
                throw new Error(errorMessage);
            }
        }
    };

    try {
        // @ts-ignore
        await Handler.applyHandle(null, {
            path: 'IntentA',
            type: EnumRequestType.INTENT,
        }, appConfig);
    } catch (e) {
        expect(e).toEqual(new Error(errorMessage));
    }
});


test('test handleOnPromise on route that immediately throws exception', async () => {
    const errorMessage = 'an error';

    expect.assertions(1);

    const appConfig: AppConfig = {
        handlers: {
            ON_REQUEST() {
                throw new Error(errorMessage);
            }
        }
    };

    try {
        const jovo: any = {}; // tslint:disable-line
        // @ts-ignore
        await Handler.handleOnPromise(jovo, appConfig.handlers.ON_REQUEST);

    } catch (e) {
        expect(e).toEqual(new Error(errorMessage));
    }
});


test('test applyHandle on route with callback', async () => {
    const appConfig: AppConfig = {
        handlers: {
            IntentA(jovo: Jovo, callback: () => void) {
                callback();
            }
        }
    };

    // @ts-ignore
    await Handler.applyHandle(null, {
        path: 'IntentA',
        type: EnumRequestType.INTENT,
    }, appConfig);
});

test('test applyHandle on route with callback that immediately throws exception', async () => {
    const errorMessage = 'an error';

    expect.assertions(1);

    const appConfig: AppConfig = {
        handlers: {
            IntentA(callback: () => {}) {
                throw new Error(errorMessage);
            }
        }
    };

    try {
        // @ts-ignore
        await Handler.applyHandle(null, {
            path: 'IntentA',
            type: EnumRequestType.INTENT,
        }, appConfig);
    } catch (e) {
        expect(e).toEqual(new Error(errorMessage));
    }
});


test('test handleOnPromise on route with callback that immediately throws exception', async () => {
    const errorMessage = 'an error';

    expect.assertions(1);

    const appConfig: AppConfig = {
        handlers: {
            ON_REQUEST(jovo: Jovo, callback: () => {}) {
                throw new Error(errorMessage);
            }
        }
    };

    try {
        const jovo: any = {}; // tslint:disable-line
        // @ts-ignore
        await Handler.handleOnPromise(jovo, appConfig.handlers.ON_REQUEST);

    } catch (e) {
        expect(e).toEqual(new Error(errorMessage));
    }
});


test('test applyHandle on route that returns a promise wrapped in a promise', async () => {
    let executed = false;

    const appConfig: AppConfig = {
        handlers: {
            async IntentA() {
                return new Promise((resolve) => {
                    executed = true;
                    resolve();
                });
            }
        }
    };

    // @ts-ignore
    await Handler.applyHandle(null, {
        path: 'IntentA',
        type: EnumRequestType.INTENT,
    }, appConfig);

    expect(executed).toBeTruthy();
});

test('test handleOnPromise on route that returns a promise wrapped in a promise', async () => {
    let executed = false;

    const appConfig: AppConfig = {
        handlers: {
            async ON_REQUEST() {
                return new Promise((resolve) => {
                    executed = true;
                    resolve();
                });
            }
        }
    };

    const jovo: any = {}; // tslint:disable-line
    // @ts-ignore
    await Handler.handleOnPromise(jovo, appConfig.handlers.ON_REQUEST);


    expect(executed).toBeTruthy();
});


test('test handleOnRequest', () => {
    const appConfig: AppConfig = {
        handlers: {
            'ON_REQUEST'() {

            },
        }
    };

    const spy = jest.spyOn(appConfig.handlers, 'ON_REQUEST');
    // @ts-ignore
    Handler.handleOnRequest(null, appConfig);
    expect(spy).toBeCalled();
});

test('test handleOnNewSession (NEW_SESSION=true)', async () => {
    let newSessionVariable = false;
    const appConfig: AppConfig = {
        handlers: {
            NEW_SESSION() {
                newSessionVariable = true;
            },
        }
    };

    const jovo = {
        isNewSession: () => true
    };

    const spy = jest.spyOn(appConfig.handlers, 'NEW_SESSION');
    // @ts-ignore
    await Handler.handleOnNewSession(jovo, appConfig);
    expect(spy).toBeCalled();
    expect(newSessionVariable).toBe(true);
});

test('test handleOnNewSession (NEW_SESSION=false)', () => {
    let newSessionVariable = false;

    const appConfig: AppConfig = {
        handlers: {
            NEW_SESSION() {
                newSessionVariable = true;

            },
        }
    };

    const jovo = {
        isNewSession: () => false
    };

    const spy = jest.spyOn(appConfig.handlers, 'NEW_SESSION');
    // @ts-ignore
    Handler.handleOnNewSession(jovo, appConfig);
    expect(newSessionVariable).toBe(false);

});

test('test handleOnNewUser (NEW_USER=true)', async () => {
    let newUserVariable = false;
    const appConfig: AppConfig = {
        handlers: {
            NEW_USER() {
                newUserVariable = true;
            },
        }
    };

    const jovo = {
        $user: {
            isNew: () => true
        }
    };

    const spy = jest.spyOn(appConfig.handlers, 'NEW_USER');
    // @ts-ignore
    await Handler.handleOnNewUser(jovo, appConfig);
    expect(spy).toBeCalled();
    expect(newUserVariable).toBe(true);
});


test('test handleOnNewUser (NEW_USER=false)', async () => {
    let newUserVariable = false;
    const appConfig: AppConfig = {
        handlers: {
            NEW_USER() {
                newUserVariable = true;
            },
        }
    };

    const jovo = {
        $user: {
            isNew: () => false
        }
    };

    const spy = jest.spyOn(appConfig.handlers, 'NEW_USER');
    // @ts-ignore
    await Handler.handleOnNewUser(jovo, appConfig);
    expect(newUserVariable).toBe(false);
});


test('test handleOnPromise with triggeredToIntent = true', async () => {
    let executed = false;

    const appConfig: AppConfig = {
        handlers: {
            async ON_REQUEST() {
                executed = true;
            }
        }
    };

    const jovo: any = { // tslint:disable-line
        triggeredToIntent: true
    };
    // @ts-ignore
    await Handler.handleOnPromise(jovo, appConfig.handlers.ON_REQUEST);


    expect(executed).toBeFalsy();
});
