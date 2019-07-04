process.env.NODE_ENV = 'UNIT_TEST';

import { I18Next } from 'jovo-cms-i18next';
import { BaseApp, HandleRequest, Jovo } from 'jovo-core';
import { Component, ComponentConfig, ComponentPlugin } from '../../src';

describe('test constructor', () => {
    let componentPlugin: ComponentPlugin;

    test('should merge config passed as param', () => {
        const config = {a: 'test'} as unknown as ComponentConfig;

        componentPlugin = new ComponentPlugin(config);

        expect(componentPlugin.config).toEqual({a: 'test'});
    });
});

describe('test install()', () => {
    test('should create I18Next object', () => {
        const app = new BaseApp();
        const componentPlugin = new ComponentPlugin();

        componentPlugin.install(app);

        expect(componentPlugin.i18next).toBeInstanceOf(I18Next);
    });
});

describe('test mergeConfig()', () => {
    let componentPlugin: ComponentPlugin;

    beforeEach(() => {
        componentPlugin = new ComponentPlugin();
    });

    test('should return merged config', () => {
        componentPlugin.config = {
            a: 'test',
        } as unknown as ComponentConfig; // hack so we don't have to implement the full ComponentPlugin class, but just the parts we need

        const appConfig = {
            b: 'test',
        } as unknown as ComponentConfig;

        const mergedConfig = componentPlugin.mergeConfig(appConfig);

        expect(mergedConfig).toEqual({
            a: 'test',
            b: 'test',
        });
    });
});

describe('test initialize()', () => {
    let componentPlugin: ComponentPlugin;
    let mockHandleRequest: HandleRequest;

    beforeEach(() => {
        componentPlugin = new ComponentPlugin();
        mockHandleRequest = {
            jovo: {} as unknown as Jovo,
        } as unknown as HandleRequest;
    });

    test('should create $components object', () => {
        componentPlugin.initialize(mockHandleRequest);

        expect(mockHandleRequest.jovo!.$components).toBeDefined();
    });

    test('should add a new Component object to `$components`', () => {
        componentPlugin.name = 'test';
        mockHandleRequest.jovo!.$components = {};

        componentPlugin.initialize(mockHandleRequest);

        expect(mockHandleRequest.jovo!.$components[ 'test' ]).toBeInstanceOf(Component); // tslint:disable-line:no-string-literal
    });
});

describe('test loadI18nFiles()', () => {
    let componentPlugin: ComponentPlugin;
    let mockHandleRequest: HandleRequest;
    let i18next: I18Next;

    beforeEach(() => {
        componentPlugin = new ComponentPlugin();

        mockHandleRequest = {
            app: {
                $cms: {},
            } as unknown as BaseApp,
        } as unknown as HandleRequest; // hack so we don't have to implement the full ComponentPlugin class, but just the parts we need

        i18next = {
            config: {},
            loadFiles: jest.fn(),
        } as unknown as I18Next;

        componentPlugin.i18next = i18next;
    });

    test('should set i18next filesDir to be pathToComponent + pathToI18n', () => {
        componentPlugin.name = 'test';
        componentPlugin.pathToI18n = './src/i18n';

        componentPlugin.loadI18nFiles(mockHandleRequest);

        expect(componentPlugin.i18next!.config.filesDir).toBe('../components/test/src/i18n');
    });

    test('should call i18next.loadFiles()', () => {
        componentPlugin.name = 'test';
        componentPlugin.pathToI18n = './src/i18n';

        componentPlugin.loadI18nFiles(mockHandleRequest);

        expect(componentPlugin.i18next!.loadFiles).toHaveBeenCalled();
    });
});
