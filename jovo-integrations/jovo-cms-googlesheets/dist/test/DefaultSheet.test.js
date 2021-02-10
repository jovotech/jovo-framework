"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const src_1 = require("../src/");
const feed = require("./mockObj/feedEntries.json");
const mockHR_1 = require("./mockObj/mockHR");
const sheetValues = require("./mockObj/publicSheetValues.json");
process.env.NODE_ENV = 'UNIT_TEST';
let handleRequest;
beforeEach(() => {
    handleRequest = new mockHR_1.MockHandleRequest();
});
describe('DefaultSheet.constructor()', () => {
    test('without config', () => {
        const defaultSheet = new src_1.DefaultSheet();
        expect(defaultSheet.config.caching).toBeTruthy();
        expect(defaultSheet.config.entity).toBeUndefined();
    });
    test('with config', () => {
        const defaultSheet = new src_1.DefaultSheet({
            caching: false,
        });
        expect(defaultSheet.config.caching).toBeFalsy();
        expect(defaultSheet.config.entity).toBeUndefined();
    });
    test('set entity with config.entity', () => {
        const defaultSheet = new src_1.DefaultSheet({
            entity: 'test',
        });
        expect(defaultSheet.config.entity).toMatch('test');
    });
    test('set entity with config.name', () => {
        const defaultSheet = new src_1.DefaultSheet({
            name: 'test',
        });
        expect(defaultSheet.config.entity).toMatch('test');
    });
});
describe('DefaultSheet.install()', () => {
    test('should set this.cms to parameter extensible', () => {
        const googleSheetsCMS = new src_1.GoogleSheetsCMS();
        const defaultSheet = new src_1.DefaultSheet();
        defaultSheet.install(googleSheetsCMS);
        expect(defaultSheet.cms).toStrictEqual(googleSheetsCMS);
    });
    test('should register middleware on retrieve', () => {
        const googleSheetsCMS = new src_1.GoogleSheetsCMS();
        const defaultSheet = new src_1.DefaultSheet();
        let fn;
        fn = googleSheetsCMS.middleware('retrieve').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeUndefined();
        defaultSheet.install(googleSheetsCMS);
        fn = googleSheetsCMS.middleware('retrieve').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeDefined();
    });
    test('should register middleware on request with caching on parent', () => {
        const googleSheetsCMS = new src_1.GoogleSheetsCMS({
            caching: false,
        });
        const defaultSheet = new src_1.DefaultSheet();
        const app = new jovo_core_1.BaseApp();
        googleSheetsCMS.install(app);
        let fn;
        fn = app.middleware('request').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeUndefined();
        defaultSheet.install(googleSheetsCMS);
        fn = app.middleware('request').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeDefined();
    });
    test('should register middleware on request with caching', () => {
        const googleSheetsCMS = new src_1.GoogleSheetsCMS();
        const defaultSheet = new src_1.DefaultSheet({
            caching: false,
        });
        const app = new jovo_core_1.BaseApp();
        googleSheetsCMS.install(app);
        let fn;
        fn = app.middleware('request').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeUndefined();
        defaultSheet.install(googleSheetsCMS);
        fn = app.middleware('request').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeDefined();
    });
});
describe('DefaultSheet.parse()', () => {
    test('should throw error if entity is not set', () => {
        const defaultSheet = new src_1.DefaultSheet();
        expect(() => defaultSheet.parse(handleRequest, [])).toThrow('entity has to be set.');
    });
    test('should set values to entity attribute', () => {
        const defaultSheet = new src_1.DefaultSheet({
            name: 'test',
        });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        defaultSheet.parse(handleRequest, []);
        expect(handleRequest.app.$cms.test).toStrictEqual([]);
    });
});
describe('DefaultSheet.parsePublicToPrivate()', () => {
    test('should throw Jovo Error with empty feed', () => {
        const defaultSheet = new src_1.DefaultSheet();
        // tslint:disable-next-line:no-string-literal
        expect(() => defaultSheet['parsePublicToPrivate']({ feed: {} })).toThrow('No spreadsheet values found.');
    });
    test('with valid values', () => {
        const defaultSheet = new src_1.DefaultSheet();
        // tslint:disable-next-line:no-string-literal
        expect(defaultSheet['parsePublicToPrivate'](feed)).toStrictEqual(sheetValues);
    });
});
describe('DefaultSheet.retrieve()', () => {
    test('should reject Promise if no parent is set', async () => {
        const defaultSheet = new src_1.DefaultSheet();
        await expect(defaultSheet.retrieve(handleRequest)).rejects.toMatch('No cms initialized.');
    });
    test('should reject Promise with JovoError if spreadsheet id is not set', async () => {
        const googleSheetsCMS = new src_1.GoogleSheetsCMS();
        const defaultSheet = new src_1.DefaultSheet();
        defaultSheet.install(googleSheetsCMS);
        await expect(defaultSheet.retrieve(handleRequest)).rejects.toStrictEqual(new jovo_core_1.JovoError('spreadsheetId has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN));
    });
    test('should reject Promise with JovoError if no name is set', async () => {
        const googleSheetsCMS = new src_1.GoogleSheetsCMS();
        const defaultSheet = new src_1.DefaultSheet({
            spreadsheetId: '123',
        });
        defaultSheet.install(googleSheetsCMS);
        await expect(defaultSheet.retrieve(handleRequest)).rejects.toStrictEqual(new jovo_core_1.JovoError('sheet name has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN));
    });
    test('should set retrieved values with parsePublicToPrivate() from mocked function loadPublicSpreadsheetData()', async () => {
        const googleSheetsCMS = new src_1.GoogleSheetsCMS();
        googleSheetsCMS.loadPublicSpreadsheetData = (spreadsheetId, sheetPosition = 1) => new Promise((res, rej) => res(feed));
        const defaultSheet = new src_1.DefaultSheet({
            access: 'public',
            name: 'test',
            range: 'A:B',
            spreadsheetId: '123',
        });
        defaultSheet.install(googleSheetsCMS);
        await defaultSheet.retrieve(handleRequest);
        expect(handleRequest.app.$cms.test).toStrictEqual(sheetValues);
    });
});
//# sourceMappingURL=DefaultSheet.test.js.map