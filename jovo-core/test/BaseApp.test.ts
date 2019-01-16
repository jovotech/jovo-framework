import {BaseApp} from "../src";

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
        'fail'
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

    //@ts-ignore
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
