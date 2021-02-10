"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src/");
const mockHR_1 = require("./mockObj/mockHR");
let handleRequest;
beforeEach(() => {
    handleRequest = new mockHR_1.MockHandleRequest();
});
describe('KeyValueSheet.constructor()', () => {
    test('without config', () => {
        const keyValueSheet = new src_1.KeyValueSheet();
        expect(keyValueSheet.config.range).toMatch('A:B');
    });
    test('with config', () => {
        const keyValueSheet = new src_1.KeyValueSheet({
            range: 'A:Z',
        });
        expect(keyValueSheet.config.range).toMatch('A:Z');
    });
});
describe('KeyValueSheet.parse()', () => {
    test('should throw error if entity is not set', () => {
        const keyValueSheet = new src_1.KeyValueSheet();
        expect(() => keyValueSheet.parse(handleRequest, [])).toThrow('entity has to be set.');
    });
    test('with empty array', () => {
        const keyValueSheet = new src_1.KeyValueSheet({
            name: 'test',
        });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyValueSheet.parse(handleRequest, []);
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });
    test('with valid values', () => {
        const keyValueSheet = new src_1.KeyValueSheet({
            name: 'test',
        });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyValueSheet.parse(handleRequest, [
            ['keys', 'values'],
            ['key1', 'value1'],
        ]);
        expect(handleRequest.app.$cms.test).toStrictEqual({
            key1: 'value1',
        });
    });
});
//# sourceMappingURL=KeyValueSheet.test.js.map