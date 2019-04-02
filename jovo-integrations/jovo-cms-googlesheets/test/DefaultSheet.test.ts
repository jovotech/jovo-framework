import { DefaultSheet, GoogleSheetsCMS } from '../src/';
import { HandleRequest, BaseApp, JovoError, ErrorCode } from 'jovo-core';
import * as feed from './mockObj/feedEntries.json';
import * as sheetValues from './mockObj/sheetValues.json';


describe('DefaultSheet.constructor()', () => {
    test('without config', () => {
        const defaultSheet = new DefaultSheet();
        expect(defaultSheet.config.caching).toBeTruthy();
        expect(defaultSheet.cms).toBeUndefined();
    });

    test('with config', () => {
        const defaultSheet = new DefaultSheet({
            caching: false,
            name: 'responses'
        });
        expect(defaultSheet.config.caching).toBeFalsy();
        expect(defaultSheet.cms).toBeUndefined();
    });

    test('set entity with config.entity', () => {
        const defaultSheet = new DefaultSheet({
            entity: 'test'
        });
        expect(defaultSheet.config.entity).toMatch('test');
    });

    test('set entity with config.name', () => {
        const defaultSheet = new DefaultSheet({
            name: 'test'
        });
        expect(defaultSheet.config.entity).toMatch('test');
    });
});

describe('DefaultSheet.install()', () => {
    test('set cms', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet();
        defaultSheet.install(googleSheetsCMS);

        expect(defaultSheet.cms).toStrictEqual(googleSheetsCMS);
    });

    test('should register middleware on retrieve', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet();

        const arr = googleSheetsCMS.middleware('retrieve')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(arr.length).toEqual(0);

        defaultSheet.install(googleSheetsCMS);

        const ar = googleSheetsCMS.middleware('retrieve')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(ar.length).toEqual(1);
    });

    test('should register middleware on request with caching on parent', () => {
        const googleSheetsCMS = new GoogleSheetsCMS({
            caching: false
        });
        const defaultSheet = new DefaultSheet();
        const app = new BaseApp();
        googleSheetsCMS.install(app);

        const arr = app.middleware('request')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(arr.length).toEqual(0);

        defaultSheet.install(googleSheetsCMS);

        const ar = app.middleware('request')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(ar.length).toEqual(1);
    });

    test('should register middleware on request with caching', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet({
            caching: false
        });
        const app = new BaseApp();
        googleSheetsCMS.install(app);

        const arr = app.middleware('request')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(arr.length).toEqual(0);

        defaultSheet.install(googleSheetsCMS);

        const ar = app.middleware('request')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(ar.length).toEqual(1);
    });
});

describe('DefaultSheet.parse()', () => {
    test('should throw error if entity is not set', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet();
        const app = new BaseApp();
        googleSheetsCMS.install(app);
        defaultSheet.install(googleSheetsCMS);

        const mockHR: HandleRequest = {
            app,
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


        expect(() => defaultSheet.parse(mockHR, []))
            .toThrow('Entity has to be set.');
    });

    test('should set values to entity attribute', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet({
            name: 'test'
        });
        const app = new BaseApp();
        googleSheetsCMS.install(app);
        defaultSheet.install(googleSheetsCMS);

        const mockHR: HandleRequest = {
            app,
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


        expect(app.$cms.test).toBeUndefined();
        defaultSheet.parse(mockHR, []);
        expect(app.$cms.test).toStrictEqual([]);
    });
});

describe('DefaultSheet.retrieve()', () => {
    test('should reject Promise if no parent is set', async () => {
        const defaultSheet = new DefaultSheet();

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
        }

        await expect(defaultSheet.retrieve(mockHR)).rejects.toMatch('No cms initialized.');
    });

    test('should throw jovo error if spreadsheet id is not set', async () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet();
        defaultSheet.install(googleSheetsCMS);

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

        await expect(defaultSheet.retrieve(mockHR)).rejects.toStrictEqual(
            new JovoError('spreadsheetId has to be set.', ErrorCode.ERR_PLUGIN)
        );
    });

    test('should throw jovo error if no name is set', async () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet({
            spreadsheetId: '123'
        });
        defaultSheet.install(googleSheetsCMS);

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

        await expect(defaultSheet.retrieve(mockHR)).rejects.toStrictEqual(
            new JovoError('sheet name has to be set.', ErrorCode.ERR_PLUGIN)
        );
    });

    test.skip('should throw jovo error if no range is set', async () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet({
            spreadsheetId: '123',
            name: 'test'
        });
        defaultSheet.install(googleSheetsCMS);

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

        await expect(defaultSheet.retrieve(mockHR)).rejects.toStrictEqual(
            new JovoError('range has to be set.', ErrorCode.ERR_PLUGIN)
        );
    });

    test('should set retrieved values from mocked method -> parsePublicToPrivate', async () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        googleSheetsCMS.loadPublicSpreadSheetData =
            (spreadsheetId: string, sheetPosition = 1) => new Promise((res, rej) => res(feed));

        const defaultSheet = new DefaultSheet({
            spreadsheetId: '123',
            name: 'test',
            range: 'A:B',
            access: 'public'
        });
        defaultSheet.install(googleSheetsCMS);

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

        await defaultSheet.retrieve(mockHR);
        expect(mockHR.app.$cms.test).toStrictEqual(sheetValues);
    });
})