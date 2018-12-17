
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
