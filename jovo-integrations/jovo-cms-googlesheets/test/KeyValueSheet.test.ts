import { HandleRequest } from 'jovo-core';

import { KeyValueSheet } from '../src/';
import { MockHandleRequest } from './mockObj/mockHR';

let handleRequest: HandleRequest;
beforeEach(() => {
    handleRequest = new MockHandleRequest();
});

describe('KeyValueSheet.constructor()', () => {
    test('without config', () => {
        const keyValueSheet = new KeyValueSheet();
        expect(keyValueSheet.config.range).toMatch('A:B');
    });

    test('with config', () => {
        const keyValueSheet = new KeyValueSheet({
            range: 'A:Z'
        });
        expect(keyValueSheet.config.range).toMatch('A:Z');
    });
});

describe('KeyValueSheet.parse()', () => {
    test('should throw error if entity is not set', () => {
        const keyValueSheet = new KeyValueSheet();

        expect(() => keyValueSheet.parse(handleRequest, []))
            .toThrow('entity has to be set.');
    });

    test('with empty array', () => {
        const keyValueSheet = new KeyValueSheet({
            name: 'test'
        });

        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyValueSheet.parse(handleRequest, []);
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });

    test('with valid values', () => {
        const keyValueSheet = new KeyValueSheet({
            name: 'test'
        });

        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyValueSheet.parse(handleRequest, [
            ['keys', 'values'], ['key1', 'value1']
        ]);
        expect(handleRequest.app.$cms.test).toStrictEqual({
            key1: 'value1'
        });
    });
});
