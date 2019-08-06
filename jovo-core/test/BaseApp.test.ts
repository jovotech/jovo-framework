import { ActionSet, BaseApp, Host, Jovo } from '../src';
import { Extensible } from '../src/Extensible';

class Parent extends Extensible {

    /**
     * Empty install() implementation
     */
    install() { // tslint:disable-line:no-empty

    }

}

test('test constructor', async () => {
    const baseApp = new BaseApp();

    const middlewareArray = [
        'setup',
        'request',
        'platform.init',
        'platform.nlu',
        'nlu',
        'user.load',
        'router',
        'handler',
        'user.save',
        'platform.output',
        'response',
        'fail',
    ];

    middlewareArray.forEach((name) => {
        expect(typeof baseApp.hasMiddleware(name) !== 'undefined');
    });
});
test('test initWebhook()', async (done) => {
    const baseApp = new BaseApp();
    baseApp.on('webhook.init', () => {
        done();
    });
    baseApp.initWebhook();
});
test('test setUp()', async (done) => {
    const baseApp = new BaseApp();
    baseApp.config.enabled = true;
    baseApp.setUp(() => {
        done();
    });

    // @ts-ignore
    baseApp.middleware('setup')!.run(undefined);
});

test('test tearDown()', async (done) => {
    const baseApp = new BaseApp();
    baseApp.config.enabled = true;
    baseApp.tearDown(() => {
        done();
    });

    baseApp.emit('exit');
});
test('test onError()', async (done) => {
    const baseApp = new BaseApp();
    baseApp.config.enabled = true;
    baseApp.onError(() => {
        done();
    });

    baseApp.emit('fail');
});

test('test onFail()', async (done) => {
    const baseApp = new BaseApp();
    baseApp.config.enabled = true;
    baseApp.onFail(() => {
        done();
    });

    baseApp.emit('fail');
});

test('test middleware()', async (done) => {

    const baseApp = new BaseApp();
    baseApp.config.enabled = true;

    baseApp.middleware('request')!.use(() => {
        done();
    });
    await baseApp.middleware('request')!.run({});
});

test('test hook()', async (done) => {

    const baseApp = new BaseApp();
    baseApp.config.enabled = true;

    baseApp.hook('request', (error: Error, host: Host, jovo: Jovo) => {
        done();
    });

    await baseApp.middleware('request')!.run({});
});

test('test hook() with await/async', async (done) => {

    const baseApp = new BaseApp();
    baseApp.config.enabled = true;

    let variable = 0;


    baseApp.hook('request', async (error: Error, host: Host, jovo: Jovo) => {
        await delay();

        variable = 1;
    });

    baseApp.hook('platform.init', (error: Error, host: Host, jovo: Jovo) => {
        expect(variable).toEqual(1);
        done();
    });

    await baseApp.middleware('request')!.run({});
    await baseApp.middleware('platform.init')!.run({});

});


test('test hook() with callbacks', async (done) => {

    const baseApp = new BaseApp();
    baseApp.config.enabled = true;

    let variable = 0;


    baseApp.hook('request', (error: Error, host: Host, jovo: Jovo, next: Function) => {
        setTimeout(() => {
            variable = 1;
            next();
        }, 300);
    });

    baseApp.hook('platform.init', (error: Error, host: Host, jovo: Jovo) => {
        expect(variable).toEqual(1);
        done();
    });

    await baseApp.middleware('request')!.run({});
    await baseApp.middleware('platform.init')!.run({});

});

/**
 * Helper method
 * Transforms setTimeout to a Promise object.
 * @returns {Promise}
 */
function delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
}
