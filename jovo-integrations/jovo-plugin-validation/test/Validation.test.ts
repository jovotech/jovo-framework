import { HandleRequest, JovoRequest, BaseApp } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { IsRequiredValidator, Validation } from '../src';

process.env.NODE_ENV = 'UNIT_TEST';

describe('Validation.constructor()', () => {
    test('without config', () => {
        const v = new Validation();
        expect(v.config.validation).toStrictEqual({});
    });

    test('with config', () => {
        const v = new Validation({
            validation: {
                key: new IsRequiredValidator()
            }
        });
        expect(v.config.validation).toStrictEqual({
            key: new IsRequiredValidator()
        });
    });
});

describe('Validation.install()', () => {
    test('should register \'run\' if validation is given', () => {
        const app = new App();
        const v = new Validation({
            validation: {
                key: new IsRequiredValidator()
            }
        });

        let fn;
        fn = app.middleware('router')!.fns.find((i: any) => i.name === 'bound validate');
        expect(fn).toBeUndefined();

        v.install(app);

        fn = app.middleware('router')!.fns.find((i: any) => i.name === 'bound validate');
        expect(fn).toBeDefined();
    });
});
