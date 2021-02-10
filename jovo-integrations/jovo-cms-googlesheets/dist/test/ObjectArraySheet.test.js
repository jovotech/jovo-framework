"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const mockHR_1 = require("./mockObj/mockHR");
let handleRequest;
beforeEach(() => {
    handleRequest = new mockHR_1.MockHandleRequest();
});
describe('ObjectArraySheet.constructor()', () => {
    test('without config', () => {
        const objectArraySheet = new src_1.ObjectArraySheet();
        expect(objectArraySheet.config.range).toMatch('A:Z');
    });
    test('with config', () => {
        const objectArraySheet = new src_1.ObjectArraySheet({
            range: 'A:F',
        });
        expect(objectArraySheet.config.range).toMatch('A:F');
    });
});
describe('ObjectArraySheet.parse()', () => {
    test('should throw error if entity is not set', () => {
        const objectArraySheet = new src_1.ObjectArraySheet();
        expect(() => objectArraySheet.parse(handleRequest, [])).toThrow('entity has to be set.');
    });
    test('with empty array', () => {
        const objectArraySheet = new src_1.ObjectArraySheet({
            name: 'test',
        });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        objectArraySheet.parse(handleRequest, []);
        expect(handleRequest.app.$cms.test).toStrictEqual([]);
    });
    test('with valid values', () => {
        const objectArraySheet = new src_1.ObjectArraySheet({
            name: 'test',
        });
        expect(handleRequest.app.$cms.test).toBeUndefined();
        objectArraySheet.parse(handleRequest, [
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
//# sourceMappingURL=ObjectArraySheet.test.js.map