"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const mockHR_1 = require("./mockObj/mockHR");
let handleRequest;
beforeEach(() => {
    handleRequest = new mockHR_1.MockHandleRequest();
});
describe('ObjectArrayTable.constructor()', () => {
    test('without config', () => {
        const objectArrayTable = new src_1.ObjectArrayTable();
        expect(objectArrayTable.config.enabled).toBeTruthy();
    });
    test('with config', () => {
        const objectArrayTable = new src_1.ObjectArrayTable({ enabled: false });
        expect(objectArrayTable.config.enabled).toBeFalsy();
    });
});
describe('ObjectArrayTable.parse()', () => {
    test('should throw error if name is not set', () => {
        const objectArrayTable = new src_1.ObjectArrayTable();
        expect(() => objectArrayTable.parse(handleRequest, [])).toThrow('name has to be set');
    });
    test('with empty array', () => {
        const objectArrayTable = new src_1.ObjectArrayTable({ name: 'test' });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        objectArrayTable.parse(handleRequest, []);
        expect(handleRequest.app.$cms.test).toStrictEqual([]);
    });
    test('with valid values', () => {
        const objectArrayTable = new src_1.ObjectArrayTable({ name: 'test' });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        objectArrayTable.parse(handleRequest, [
            ['keys', 'values'],
            ['key1', 'value1'],
        ]);
        expect(handleRequest.app.$cms.test).toStrictEqual([
            {
                keys: 'key1',
                values: 'value1',
            },
        ]);
    });
});
//# sourceMappingURL=ObjectArrayTable.test.js.map