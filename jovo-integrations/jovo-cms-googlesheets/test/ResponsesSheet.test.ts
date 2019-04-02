import { ResponsesSheet, GoogleSheetsCMS } from '../src/';
import { HandleRequest, BaseApp, Cms, ErrorCode } from 'jovo-core';
import * as sheetValues from './mockObj/sheetValues.json';

describe('ResponsesSheet.constructor()', () => {
    test('without config', () => {
        const responsesSheet = new ResponsesSheet();
        expect(responsesSheet.config.range).toMatch('A:Z');
    });

    test('with config', () => {
        const responsesSheet = new ResponsesSheet({
            range: 'A:B'
        });

        expect(responsesSheet.config.range).toMatch('A:B');
    });
});

describe('ResponsesSheet.install()', () => {
    test('t function for cms', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const responsesSheet = new ResponsesSheet();

        expect(new Cms().t).toBeUndefined();
        responsesSheet.install(googleSheetsCMS);
        expect(new Cms().t).toBeInstanceOf(Function);
    });
});

describe('ResponsesSheet.parse()', () => {
    test('should throw error if entity is not set', () => {
        const responsesSheet = new ResponsesSheet();
        const mockHR: HandleRequest = {
            app: new BaseApp(),
            host: {
                hasWriteFileAccess: true,
                headers: {},
                $request: {},
                getRequestObject() { },
                setResponse() {
                    return new Promise((res, rej) => { });
                },
                fail() { }
            }
        };

        expect(() => responsesSheet.parse(mockHR, sheetValues))
            .toThrow('Entity has to be set.');
    });

    test('with empty array', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });
        const mockHR: HandleRequest = {
            app: new BaseApp(),
            host: {
                hasWriteFileAccess: true,
                headers: {},
                $request: {},
                getRequestObject() {

                },
                setResponse() {
                    return new Promise((res, rej) => {

                    });
                },
                fail() {

                }
            }
        };

        expect(mockHR.app.$cms.I18Next).toBeUndefined();
        expect(mockHR.app.$cms.test).toBeUndefined();
        responsesSheet.parse(mockHR, []);
        expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
        expect(mockHR.app.$cms.test).toStrictEqual({});
        // console.log(mockHR.app.$cms.I18Next.i18n.store.data);
    });

    test('without headers', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });
        const mockHR: HandleRequest = {
            app: new BaseApp(),
            host: {
                hasWriteFileAccess: true,
                headers: {},
                $request: {},
                getRequestObject() {

                },
                setResponse() {
                    return new Promise((res, rej) => {

                    });
                },
                fail() {

                }
            }
        };

        expect(mockHR.app.$cms.I18Next).toBeUndefined();
        expect(mockHR.app.$cms.test).toBeUndefined();
        responsesSheet.parse(mockHR, [
            [
                'WELCOME',
                'Welcome_Default'
            ],
            [
                'GOODBYE',
                'Goodbye_Default'
            ]
        ]);
        expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
        expect(mockHR.app.$cms.test).toStrictEqual({});
    });

    test('without values', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });
        const mockHR: HandleRequest = {
            app: new BaseApp(),
            host: {
                hasWriteFileAccess: true,
                headers: {},
                $request: {},
                getRequestObject() {

                },
                setResponse() {
                    return new Promise((res, rej) => {

                    });
                },
                fail() {

                }
            }
        };

        expect(mockHR.app.$cms.I18Next).toBeUndefined();
        expect(mockHR.app.$cms.test).toBeUndefined();
        responsesSheet.parse(mockHR, [
            [
                'key',
                'en-us'
            ]
        ]);
        expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
        expect(mockHR.app.$cms.test).toStrictEqual({});
    });

    test('with valid values', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });
        const mockHR: HandleRequest = {
            app: new BaseApp(),
            host: {
                hasWriteFileAccess: true,
                headers: {},
                $request: {},
                getRequestObject() {

                },
                setResponse() {
                    return new Promise((res, rej) => {

                    });
                },
                fail() {

                }
            }
        };

        expect(mockHR.app.$cms.I18Next).toBeUndefined();
        expect(mockHR.app.$cms.test).toBeUndefined();
        responsesSheet.parse(mockHR, sheetValues);
        expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
        expect(mockHR.app.$cms.test).toStrictEqual({
            'en-US': {
                translation: {
                    WELCOME: ['Welcome_Default'],
                    GOODBYE: ['Goodbye_Default', 'Bye_Default']
                }
            },
            'de-DE': {
                translation: {
                    WELCOME: ['Willkommen_Default'],
                    GOODBYE: []
                }
            }
        });
    });
})