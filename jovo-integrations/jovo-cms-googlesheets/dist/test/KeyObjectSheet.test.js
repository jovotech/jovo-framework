"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src/");
const mockHR_1 = require("./mockObj/mockHR");
let handleRequest;
beforeEach(() => {
    handleRequest = new mockHR_1.MockHandleRequest();
});
describe('KeyObjectSheet.constructor()', () => {
    test('without config', () => {
        const keyObjectSheet = new src_1.KeyObjectSheet();
        expect(keyObjectSheet.config.range).toMatch('A:C');
    });
    test('with config', () => {
        const keyObjectSheet = new src_1.KeyObjectSheet({
            range: 'A:Z',
        });
        expect(keyObjectSheet.config.range).toMatch('A:Z');
    });
});
describe('KeyObjectSheet.parse()', () => {
    test('should throw error if entity is not set', () => {
        const keyObjectSheet = new src_1.KeyObjectSheet();
        expect(() => keyObjectSheet.parse(handleRequest, [])).toThrow('entity has to be set.');
    });
    test('with empty array', () => {
        const keyObjectSheet = new src_1.KeyObjectSheet({
            name: 'test',
        });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyObjectSheet.parse(handleRequest, []);
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });
    test('with valid values', () => {
        const keyObjectSheet = new src_1.KeyObjectSheet({
            name: 'test',
        });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyObjectSheet.parse(handleRequest, [
            ['main_keys', 'attribute1', 'attribute2'],
            ['key1', 'value1', 'value2'],
        ]);
        expect(handleRequest.app.$cms.test).toStrictEqual({
            key1: { attribute1: 'value1', attribute2: 'value2' },
        });
    });
    test('with some empty values', () => {
        const keyObjectSheet = new src_1.KeyObjectSheet({
            name: 'test',
        });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyObjectSheet.parse(handleRequest, [
            ['main_keys', 'attribute1', 'attribute2'],
            ['key1', undefined, ''],
        ]);
        expect(handleRequest.app.$cms.test).toStrictEqual({
            key1: { attribute1: undefined, attribute2: undefined },
        });
    });
});
//# sourceMappingURL=KeyObjectSheet.test.js.map