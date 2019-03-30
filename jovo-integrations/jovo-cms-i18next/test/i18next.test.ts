import { I18Next } from '../src/';
import { HandleRequest, BaseApp, SpeechBuilder } from 'jovo-core';
import * as i18nData from './i18n/en-US.json';

describe('I18Next.constructor()', () => {
    test('without config', () => {
        const i18n = new I18Next();
        expect(i18n.config.filesDir).toEqual('./i18n');
    });

    test('with config', () => {
        const i18n = new I18Next({ filesDir: '../test' });
        expect(i18n.config.filesDir).toEqual('../test');
    });
});

describe('I18Next.install()', () => {
    test.only('new functions', () => {
        const speech = new SpeechBuilder();
        expect(speech.t).toBeUndefined();
        expect(speech.addT).toBeUndefined();
        const baseApp = new BaseApp();
        const i18n = new I18Next();
        i18n.install(baseApp);
        const s = new SpeechBuilder();
        console.log(typeof s.t);
        expect(typeof s.t).toEqual('function');
        expect(typeof s.addT).toEqual('function');
    });
});

describe('I18Next.loadFiles()', () => {
    test('with config.filesDir', async () => {
        const i18Next = new I18Next({
            filesDir: './test/i18n/'
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

        mockHR.app.getAppTypes = () => {
            return ['AlexaSkill'];
        };

        await i18Next.loadFiles(mockHR);

        // @ts-ignore
        expect(mockHR.app.config.platformSpecificResponses).toBe(true);
        expect(mockHR.app.$cms.I18Next.resources['en-US'].translation.WELCOME).toEqual('Welcome_Default');
        expect(mockHR.app.$cms.I18Next.resources['en-US'].AlexaSkill.translation.WELCOME).toEqual('Welcome_Alexa');
        expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
    });

    test('with config.resources', async () => {
        const i18Next = new I18Next({
            resources: {
                'en-US': i18nData
            }
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

        mockHR.app.getAppTypes = () => {
            return ['AlexaSkill'];
        };

        await i18Next.loadFiles(mockHR);

        // @ts-ignore
        expect(mockHR.app.config.platformSpecificResponses).toBe(true);
        expect(mockHR.app.$cms.I18Next.resources['en-US'].translation.WELCOME).toEqual('Welcome_Default');
        expect(mockHR.app.$cms.I18Next.resources['en-US'].AlexaSkill.translation.WELCOME).toEqual('Welcome_Alexa');
        expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
    });

    test('with config.resources without platform-specifics', async () => {
        const i18Next = new I18Next({
            resources: {
                'en-US': {
                    translation: i18nData.translation
                }
            }
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

        mockHR.app.getAppTypes = () => {
            return ['AlexaSkill'];
        };

        await i18Next.loadFiles(mockHR);

        // @ts-ignore
        expect(mockHR.app.config.platformSpecificResponses).toBeUndefined();
        expect(mockHR.app.$cms.I18Next.resources['en-US'].translation.WELCOME).toEqual('Welcome_Default');
        expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
    });
});