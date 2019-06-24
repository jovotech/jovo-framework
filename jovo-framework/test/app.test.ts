import { Component } from '../src';
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
    let component: Component;
    let app: App;

    beforeEach(() => {
        component = new Component();
        app = new App();
    });

    test('should add component\'s handler to handlers', () => {
        const testFunction = () => {
            //
        };
        component.handler = {
            test: testFunction,
        };

        app.useComponents(component);

        expect(app.config.handlers).toEqual({
            test: testFunction,
        });
    });

    test('should add component to $plugins map', () => {
        component.name = 'test';

        app.useComponents(component);

        expect(app.$plugins.get(component.name)).toBe(component);
    });

    test('should call component\'s install function', () => {
        jest.spyOn(component, 'install');

        app.useComponents(component);

        expect(component.install).toHaveBeenCalled();
    });

    test('should run through array of components', () => {
        const component2 = new Component();
        jest.spyOn(component, 'install');
        jest.spyOn(component2, 'install');

        app.useComponents(component, component2);

        expect(component.install).toHaveBeenCalled();
        expect(component2.install).toHaveBeenCalled();
    });
});
