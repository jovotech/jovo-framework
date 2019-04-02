import { ResponsesSheet, GoogleSheetsCMS } from '../src/';
import { HandleRequest, BaseApp, Cms, ErrorCode } from 'jovo-core';
import * as sheetValues from './mockObj/sheetValues.json';
import { MockHandleRequest } from './mockObj/mockHR';

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
        const handleRequest = new MockHandleRequest();
        expect(() => responsesSheet.parse(handleRequest, sheetValues))
            .toThrow('Entity has to be set.');
    });

    test('with empty array', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });
        const handleRequest = new MockHandleRequest();

        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();
        responsesSheet.parse(handleRequest, []);
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });

    test('without headers', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });
        const handleRequest = new MockHandleRequest();

        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();
        responsesSheet.parse(handleRequest, [
            [
                'WELCOME',
                'Welcome_Default'
            ],
            [
                'GOODBYE',
                'Goodbye_Default'
            ]
        ]);
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });

    test('without values', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });
        const handleRequest = new MockHandleRequest();

        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();
        responsesSheet.parse(handleRequest, [
            [
                'key',
                'en-us'
            ]
        ]);
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });

    test('with valid values', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });
        const handleRequest = new MockHandleRequest();

        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();
        responsesSheet.parse(handleRequest, sheetValues);
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual({
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