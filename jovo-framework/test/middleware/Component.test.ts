process.env.NODE_ENV = 'UNIT_TEST';

import { I18Next } from 'jovo-cms-i18next';
import { BaseApp, HandleRequest, Jovo } from 'jovo-core';
import { Component, Config as ComponentConfig } from '../../src/middleware/Component';

describe('test constructor', () => {
    let component: Component;

    test('should merge config passed as param', () => {
        const config = {a: 'test'} as unknown as ComponentConfig;

        component = new Component(config);

        expect(component.config).toEqual({a: 'test'});
    });
});

describe('test install()', () => {
    test('should create I18Next object', () => {
        const app = new BaseApp();
        const component = new Component();

        component.install(app);

        expect(component.i18next).toBeInstanceOf(I18Next);
    });
});

describe('test mergeConfig()', () => {
    let component: Component;

    beforeEach(() => {
        component = new Component();
    });

    test('should return merged config', () => {
        component.config = {
            a: 'test',
        } as unknown as ComponentConfig; // hack so we don't have to implement the full Component class, but just the parts we need

        const appConfig = {
            b: 'test',
        } as unknown as ComponentConfig;

        const mergedConfig = component.mergeConfig(appConfig);

        expect(mergedConfig).toEqual({
            a: 'test',
            b: 'test',
        });
    });
});

describe('test initialize()', () => {
    let component: Component;
    let mockHandleRequest: HandleRequest;

    beforeEach(() => {
        component = new Component();
        mockHandleRequest = {
            jovo: {} as unknown as Jovo,
        } as unknown as HandleRequest;
    });

    test('should create $components object', () => {
        component.initialize(mockHandleRequest);

        expect(mockHandleRequest.jovo!.$components).toBeDefined();
    });

    test('should add reference to component to `$components` object', () => {
        component.name = 'test';
        mockHandleRequest.jovo!.$components = {};

        component.initialize(mockHandleRequest);

        expect(mockHandleRequest.jovo!.$components[ 'test' ]).toBe(component); // tslint:disable-line:no-string-literal
    });
});

describe('test loadI18nFiles()', () => {
    let component: Component;
    let mockHandleRequest: HandleRequest;
    let i18next: I18Next;

    beforeEach(() => {
        component = new Component();

        mockHandleRequest = {
            app: {
                $cms: {},
            } as unknown as BaseApp,
        } as unknown as HandleRequest; // hack so we don't have to implement the full Component class, but just the parts we need

        i18next = {
            config: {},
            loadFiles: jest.fn(),
        } as unknown as I18Next;

        component.i18next = i18next;
    });

    test('should set i18next filesDir to be pathToComponent + pathToI18n', () => {
        component.name = 'test';
        component.pathToI18n = './src/i18n';

        component.loadI18nFiles(mockHandleRequest);

        expect(component.i18next!.config.filesDir).toBe('../components/test/src/i18n');
    });

    test('should call i18next.loadFiles()', () => {
        component.name = 'test';
        component.pathToI18n = './src/i18n';

        component.loadI18nFiles(mockHandleRequest);

        expect(component.i18next!.loadFiles).toHaveBeenCalled();
    });
});
