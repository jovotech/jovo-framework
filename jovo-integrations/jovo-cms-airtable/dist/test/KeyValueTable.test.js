"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const mockHR_1 = require("./mockObj/mockHR");
let handleRequest;
beforeEach(() => {
    handleRequest = new mockHR_1.MockHandleRequest();
});
describe('KeyValueTable.constructor()', () => {
    test('without config', () => {
        const keyValueTable = new src_1.KeyValueTable();
        expect(keyValueTable.config.enabled).toBeTruthy();
    });
    test('with config', () => {
        const keyValueTable = new src_1.KeyValueTable({ enabled: false });
        expect(keyValueTable.config.enabled).toBeFalsy();
    });
});
describe('KeyValueTable.parse()', () => {
    test('should throw error if name is not set', () => {
        const keyValueTable = new src_1.KeyValueTable();
        expect(() => keyValueTable.parse(handleRequest, [])).toThrow('name has to be set');
    });
    test('with empty array', () => {
        const keyValueTable = new src_1.KeyValueTable({ name: 'test' });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyValueTable.parse(handleRequest, []);
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });
    test('with valid values', () => {
        const keyValueTable = new src_1.KeyValueTable({ name: 'test' });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyValueTable.parse(handleRequest, [
            ['keys', 'values'],
            ['key1', 'value1'],
        ]);
        expect(handleRequest.app.$cms.test).toStrictEqual({
            key1: 'value1',
        });
    });
});
//# sourceMappingURL=KeyValueTable.test.js.map