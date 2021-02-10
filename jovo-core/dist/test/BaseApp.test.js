"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
process.env.NODE_ENV = 'UNIT_TEST';
class Parent extends src_1.Extensible {
    /**
     * Empty install() implementation
     */
    install() {
        // tslint:disable-line:no-empty
    }
}
test('test constructor', async () => {
    const baseApp = new src_1.BaseApp();
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
    const baseApp = new src_1.BaseApp();
    baseApp.on('webhook.init', () => {
        done();
    });
    baseApp.initWebhook();
});
test('test setUp()', async (done) => {
    const baseApp = new src_1.BaseApp();
    baseApp.config.enabled = true;
    baseApp.setUp(() => {
        done();
    });
    // @ts-ignore
    baseApp.middleware('setup').run(undefined);
});
test('test tearDown()', async (done) => {
    const baseApp = new src_1.BaseApp();
    baseApp.config.enabled = true;
    baseApp.tearDown(() => {
        done();
    });
    baseApp.emit('exit');
});
test('test onError()', async (done) => {
    const baseApp = new src_1.BaseApp();
    baseApp.config.enabled = true;
    baseApp.onError(() => {
        done();
    });
    baseApp.emit('fail');
});
test('test onFail()', async (done) => {
    const baseApp = new src_1.BaseApp();
    baseApp.config.enabled = true;
    baseApp.onFail(() => {
        done();
    });
    baseApp.emit('fail');
});
test('test middleware()', async (done) => {
    const baseApp = new src_1.BaseApp();
    baseApp.config.enabled = true;
    baseApp.middleware('request').use(() => {
        done();
    });
    await baseApp.middleware('request').run({});
});
test('test hook()', async (done) => {
    const baseApp = new src_1.BaseApp();
    baseApp.config.enabled = true;
    baseApp.hook('request', (error, host, jovo) => {
        done();
    });
    await baseApp.middleware('request').run({});
});
test('test hook() with await/async', async (done) => {
    const baseApp = new src_1.BaseApp();
    baseApp.config.enabled = true;
    let variable = 0;
    baseApp.hook('request', async (error, host, jovo) => {
        await delay();
        variable = 1;
    });
    baseApp.hook('platform.init', (error, host, jovo) => {
        expect(variable).toEqual(1);
        done();
    });
    await baseApp.middleware('request').run({});
    await baseApp.middleware('platform.init').run({});
});
test('test hook() with callbacks', async (done) => {
    const baseApp = new src_1.BaseApp();
    baseApp.config.enabled = true;
    let variable = 0;
    baseApp.hook('request', (error, host, jovo, next) => {
        setTimeout(() => {
            variable = 1;
            next();
        }, 300);
    });
    baseApp.hook('platform.init', (error, host, jovo) => {
        expect(variable).toEqual(1);
        done();
    });
    await baseApp.middleware('request').run({});
    await baseApp.middleware('platform.init').run({});
});
describe('test useComponents()', () => {
    let componentPlugin;
    let app;
    beforeEach(() => {
        componentPlugin = new src_1.ComponentPlugin();
        app = new src_1.BaseApp();
    });
    test('should add componentPlugin to $plugins map', () => {
        componentPlugin.name = 'test';
        app.useComponents(componentPlugin);
        expect(app.$plugins.get(componentPlugin.name)).toBe(componentPlugin);
    });
    test(`should call componentPlugin's install function`, () => {
        jest.spyOn(componentPlugin, 'install');
        app.useComponents(componentPlugin);
        expect(componentPlugin.install).toHaveBeenCalled();
    });
    test('should run through array of components', () => {
        const componentPlugin2 = new src_1.ComponentPlugin();
        jest.spyOn(componentPlugin, 'install');
        jest.spyOn(componentPlugin2, 'install');
        app.useComponents(componentPlugin, componentPlugin2);
        expect(componentPlugin.install).toHaveBeenCalled();
        expect(componentPlugin2.install).toHaveBeenCalled();
    });
});
/**
 * Helper method
 * Transforms setTimeout to a Promise object.
 * @returns {Promise}
 */
function delay() {
    return new Promise((resolve) => setTimeout(resolve, 250));
}
//# sourceMappingURL=BaseApp.test.js.map