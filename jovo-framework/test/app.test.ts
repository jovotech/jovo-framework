import { ComponentPlugin } from '../src';
import { App } from './../src/App';

let appBase: App;
jest.setTimeout(250);
process.env.NODE_ENV = 'UNIT_TEST';


appBase = new App();
test('test onRequest', (done) => {

    appBase.onRequest(() => {
        done();
    });

    appBase.emit('request');
});


test('test onResponse', (done) => {

    appBase.onResponse(() => {
        done();
    });

    appBase.emit('response');
});

test('test onFail', (done) => {

    appBase.onFail(() => {
        done();
    });

    appBase.emit('fail');
});
test('test onError', (done) => {

    appBase.onError(() => {
        done();
    });

    appBase.emit('fail');
});

describe('test useComponents()', () => {
    let componentPlugin: ComponentPlugin;
    let app: App;

    beforeEach(() => {
        componentPlugin = new ComponentPlugin();
        app = new App();
    });

    test('should add componentPlugin to $plugins map', () => {
        componentPlugin.name = 'test';

        app.useComponents(componentPlugin);

        expect(app.$plugins.get(componentPlugin.name)).toBe(componentPlugin);
    });

    test('should call componentPlugin\'s install function', () => {
        jest.spyOn(componentPlugin, 'install');

        app.useComponents(componentPlugin);

        expect(componentPlugin.install).toHaveBeenCalled();
    });

    test('should run through array of components', () => {
        const componentPlugin2 = new ComponentPlugin();
        jest.spyOn(componentPlugin, 'install');
        jest.spyOn(componentPlugin2, 'install');

        app.useComponents(componentPlugin, componentPlugin2);

        expect(componentPlugin.install).toHaveBeenCalled();
        expect(componentPlugin2.install).toHaveBeenCalled();
    });
});
