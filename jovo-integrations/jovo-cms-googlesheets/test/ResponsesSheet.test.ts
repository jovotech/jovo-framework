import { ResponsesSheet, GoogleSheetsCMS } from '../src/';
import { Cms, BaseApp, HandleRequest } from 'jovo-core';
import * as cSheetValues from './mockObj/sheetValues.json';
import { MockHandleRequest } from './mockObj/mockHR';
import _cloneDeep = require('lodash.clonedeep');
const i18n = require('i18next');

let sheetValues: any[];     // tslint: disable-line
let handleRequest: HandleRequest;
beforeEach(() => {
    handleRequest = new MockHandleRequest();
    sheetValues = _cloneDeep(cSheetValues);
});

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
        expect(() => responsesSheet.parse(handleRequest, sheetValues))
            .toThrow('Entity has to be set.');
    });

    test('with empty array', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });

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

    test('with valid values and platform-specific responses', () => {
        const app = new BaseApp();
        const googleSheetsCMS = new GoogleSheetsCMS();
        googleSheetsCMS.install(app);
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });
        responsesSheet.install(googleSheetsCMS);
        handleRequest.app.getAppTypes = () => {
            return ['AlexaSkill'];
        }

        sheetValues[0].push('en-us-alexaskill');
        sheetValues[1].push('Welcome_Alexa');

        expect(handleRequest.app.$cms.I18Next).toBeUndefined();
        expect(handleRequest.app.$cms.test).toBeUndefined();

        responsesSheet.parse(handleRequest, sheetValues);

        // @ts-ignore
        expect(app.config.platformSpecificResponses).toBeTruthy();
        expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
        expect(handleRequest.app.$cms.test).toStrictEqual({
            'en-US': {
                translation: {
                    WELCOME: ['Welcome_Default'],
                    GOODBYE: ['Goodbye_Default', 'Bye_Default']
                },
                AlexaSkill: {
                    translation: {
                        WELCOME: ['Welcome_Alexa']
                    }
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

    test('should merge new values in existing i18n object', () => {
        const responsesSheet = new ResponsesSheet({
            name: 'test'
        });

        i18n.init({
            resources: {
                'en-US': {
                    translation: {
                        WELCOME: ['Welcome']
                    }
                }
            },
            load: 'all',
            returnObjects: true,
            interpolation: {
                escapeValue: false, // do not escape ssml tags
            }
        });

        handleRequest.app.$cms.I18Next = { i18n };

        expect(handleRequest.app.$cms.I18Next.i18n.store.data)
            .toStrictEqual({
                'en-US': {
                    translation: {
                        WELCOME: ['Welcome']
                    }
                }
            });

        responsesSheet.parse(handleRequest, sheetValues);

        expect(handleRequest.app.$cms.I18Next.i18n.store.data)
            .toStrictEqual({
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