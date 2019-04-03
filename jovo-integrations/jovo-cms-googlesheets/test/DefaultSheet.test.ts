import { DefaultSheet, GoogleSheetsCMS } from '../src/';
import { BaseApp, JovoError, ErrorCode } from 'jovo-core';
import * as feed from './mockObj/feedEntries.json';
import * as sheetValues from './mockObj/sheetValues.json';
import { MockHandleRequest } from './mockObj/mockHR';

describe('DefaultSheet.constructor()', () => {
    test('without config', () => {
        const defaultSheet = new DefaultSheet();
        expect(defaultSheet.config.caching).toBeTruthy();
        expect(defaultSheet.config.entity).toBeUndefined();
    });

    test('with config', () => {
        const defaultSheet = new DefaultSheet({
            caching: false,
        });
        expect(defaultSheet.config.caching).toBeFalsy();
        expect(defaultSheet.config.entity).toBeUndefined();
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
    test('should set this.cms to parameter extensible', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet();
        defaultSheet.install(googleSheetsCMS);

        expect(defaultSheet.cms).toStrictEqual(googleSheetsCMS);
    });

    test('should register middleware on retrieve', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet();

        const fnsOld = googleSheetsCMS.middleware('retrieve')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(fnsOld.length).toEqual(0);

        defaultSheet.install(googleSheetsCMS);

        const fnsNew = googleSheetsCMS.middleware('retrieve')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(fnsNew.length).toEqual(1);
    });

    test('should register middleware on request with caching on parent', () => {
        const googleSheetsCMS = new GoogleSheetsCMS({
            caching: false
        });
        const defaultSheet = new DefaultSheet();
        const app = new BaseApp();
        googleSheetsCMS.install(app);

        const fnsOld = app.middleware('request')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(fnsOld.length).toEqual(0);

        defaultSheet.install(googleSheetsCMS);

        const fnsNew = app.middleware('request')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(fnsNew.length).toEqual(1);
    });

    test('should register middleware on request with caching', () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet({
            caching: false
        });
        const app = new BaseApp();
        googleSheetsCMS.install(app);

        const fnsOld = app.middleware('request')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(fnsOld.length).toEqual(0);

        defaultSheet.install(googleSheetsCMS);

        const fnsNew = app.middleware('request')!.fns.map((i) => {
            return i.name === 'bound retrieve' ? i : null;
        });
        expect(fnsNew.length).toEqual(1);
    });
});

describe('DefaultSheet.parse()', () => {
    test('should throw error if entity is not set', () => {
        const defaultSheet = new DefaultSheet();
        const handleRequest = new MockHandleRequest();

        expect(() => defaultSheet.parse(handleRequest, []))
            .toThrow('Entity has to be set.');
    });

    test('should set values to entity attribute', () => {
        const defaultSheet = new DefaultSheet({
            name: 'test'
        });
        const handleRequest = new MockHandleRequest();     

        expect(handleRequest.app.$cms.test).toBeUndefined();
        defaultSheet.parse(handleRequest, []);
        expect(handleRequest.app.$cms.test).toStrictEqual([]);
    });
});

describe('DefaultSheet.retrieve()', () => {
    test('should reject Promise if no parent is set', async () => {
        const defaultSheet = new DefaultSheet();
        const handleRequest = new MockHandleRequest();
        await expect(defaultSheet.retrieve(handleRequest)).rejects.toMatch('No cms initialized.');
    });

    test('should reject Promise with JovoError if spreadsheet id is not set', async () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet();
        defaultSheet.install(googleSheetsCMS);

        const handleRequest = new MockHandleRequest();

        await expect(defaultSheet.retrieve(handleRequest)).rejects.toStrictEqual(
            new JovoError('spreadsheetId has to be set.', ErrorCode.ERR_PLUGIN)
        );
    });

    test('should reject Promise with JovoError if no name is set', async () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet({
            spreadsheetId: '123'
        });
        defaultSheet.install(googleSheetsCMS);

        const handleRequest = new MockHandleRequest();

        await expect(defaultSheet.retrieve(handleRequest)).rejects.toStrictEqual(
            new JovoError('sheet name has to be set.', ErrorCode.ERR_PLUGIN)
        );
    });

    test.skip('should reject Promise with JovoError if no range is set', async () => {
        const googleSheetsCMS = new GoogleSheetsCMS();
        const defaultSheet = new DefaultSheet({
            spreadsheetId: '123',
            name: 'test'
        });
        defaultSheet.install(googleSheetsCMS);

        const handleRequest = new MockHandleRequest();

        await expect(defaultSheet.retrieve(handleRequest)).rejects.toStrictEqual(
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
            access: 'public'    // this values does not matter for this test, as long as the right method is mocked
        });
        defaultSheet.install(googleSheetsCMS);

        const handleRequest = new MockHandleRequest();

        await defaultSheet.retrieve(handleRequest);
        expect(handleRequest.app.$cms.test).toStrictEqual(sheetValues);
    });
});