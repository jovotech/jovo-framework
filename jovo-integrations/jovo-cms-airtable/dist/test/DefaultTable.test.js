"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const src_1 = require("../src");
const mockHR_1 = require("./mockObj/mockHR");
process.env.NODE_ENV = 'UNIT_TEST';
let handleRequest;
beforeEach(() => {
    handleRequest = new mockHR_1.MockHandleRequest();
});
describe('DefaultTable.constructor()', () => {
    test('without config', () => {
        const defaultTable = new src_1.DefaultTable();
        expect(defaultTable.config.caching).toBeTruthy();
    });
    test('with config', () => {
        // TODO selectOptions maybe not required?
        const defaultTable = new src_1.DefaultTable({ caching: false });
        expect(defaultTable.config.caching).toBeFalsy();
    });
});
describe('DefaultTable.install()', () => {
    test('should set this.cms to parameter extensible', () => {
        const airtableCMS = new src_1.AirtableCMS();
        const defaultTable = new src_1.DefaultTable();
        defaultTable.install(airtableCMS);
        expect(defaultTable.cms).toStrictEqual(airtableCMS);
    });
    test('should register middleware on retrieve', () => {
        const airtableCMS = new src_1.AirtableCMS();
        const defaultTable = new src_1.DefaultTable();
        let fn;
        fn = airtableCMS.middleware('retrieve').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeUndefined();
        defaultTable.install(airtableCMS);
        fn = airtableCMS.middleware('retrieve').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeDefined();
    });
    test('should set this.config.table with constructor.config.table', () => {
        const airtableCMS = new src_1.AirtableCMS();
        const defaultTable = new src_1.DefaultTable({ table: 'test' });
        defaultTable.install(airtableCMS);
        expect(defaultTable.config.table).toMatch('test');
    });
    test('should set this.config.table with constructor.config.name', () => {
        const airtableCMS = new src_1.AirtableCMS();
        const defaultTable = new src_1.DefaultTable({ name: 'test' });
        defaultTable.install(airtableCMS);
        expect(defaultTable.config.table).toMatch('test');
    });
    test('caching on parent', () => {
        const app = new jovo_core_1.BaseApp();
        const airtableCMS = new src_1.AirtableCMS({ caching: false, apiKey: 'test', baseId: '123' });
        const defaultTable = new src_1.DefaultTable();
        airtableCMS.install(app);
        let fn;
        fn = app.middleware('request').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeUndefined();
        defaultTable.install(airtableCMS);
        fn = app.middleware('request').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeDefined();
    });
    test('caching', () => {
        const app = new jovo_core_1.BaseApp();
        const airtableCMS = new src_1.AirtableCMS({ apiKey: 'test', baseId: '123' });
        const defaultTable = new src_1.DefaultTable({ caching: false });
        airtableCMS.install(app);
        let fn;
        fn = app.middleware('request').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeUndefined();
        defaultTable.install(airtableCMS);
        fn = app.middleware('request').fns.find((i) => i.name === 'bound retrieve');
        expect(fn).toBeDefined();
    });
});
describe('DefaultTable.parse()', () => {
    test('should set handleRequest values to param values', () => {
        const defaultTable = new src_1.DefaultTable({ selectOptions: {}, name: 'test' });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        defaultTable.parse(handleRequest, {});
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });
});
describe('DefaultTable.retrieve', () => {
    test('should throw error if this.cms is not set', () => {
        const defaultTable = new src_1.DefaultTable();
        expect(defaultTable.retrieve(handleRequest)).rejects.toStrictEqual(new jovo_core_1.JovoError('no cms initialized', jovo_core_1.ErrorCode.ERR_PLUGIN));
    });
    test('should throw error if config.table is not set', () => {
        const airtableCMS = new src_1.AirtableCMS();
        const defaultTable = new src_1.DefaultTable();
        defaultTable.install(airtableCMS);
        expect(defaultTable.retrieve(handleRequest)).rejects.toStrictEqual(new jovo_core_1.JovoError('table has to be set', jovo_core_1.ErrorCode.ERR_PLUGIN));
    });
    test('should throw error if config.name is not set', () => {
        const airtableCMS = new src_1.AirtableCMS();
        const defaultTable = new src_1.DefaultTable({ table: 'test', selectOptions: {} });
        defaultTable.install(airtableCMS);
        expect(defaultTable.retrieve(handleRequest)).rejects.toStrictEqual(new jovo_core_1.JovoError('name has to be set', jovo_core_1.ErrorCode.ERR_PLUGIN));
    });
    test('should call loadTableData() and set values with parse()', async () => {
        const airtableCMS = new src_1.AirtableCMS();
        const defaultTable = new src_1.DefaultTable({ table: 'table', name: 'test', selectOptions: {} });
        defaultTable.install(airtableCMS);
        airtableCMS.loadTableData = jest.fn().mockResolvedValue({});
        expect(handleRequest.app.$cms.test).toBeUndefined();
        await defaultTable.retrieve(handleRequest);
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });
});
//# sourceMappingURL=DefaultTable.test.js.map