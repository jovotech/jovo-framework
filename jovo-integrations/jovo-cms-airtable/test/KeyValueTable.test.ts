import { HandleRequest } from 'jovo-core';
import { KeyValueTable } from '../src';
import { MockHandleRequest } from './mockObj/mockHR';

let handleRequest: HandleRequest;
beforeEach(() => {
    handleRequest = new MockHandleRequest();
});

describe('KeyValueTable.constructor()', () => {
    test('without config', () => {
        const keyValueTable = new KeyValueTable();
        expect(keyValueTable.config.enabled).toBeTruthy();
    });

    test('with config', () => {
        const keyValueTable = new KeyValueTable({enabled: false});
        expect(keyValueTable.config.enabled).toBeFalsy();
    });
});

describe('KeyValueTable.parse()', () => {
    test('should throw error if name is not set', () => {
        const keyValueTable = new KeyValueTable();
        expect(() => keyValueTable.parse(handleRequest, []))
            .toThrow('name has to be set');
    });

    test('with empty array', () => {
        const keyValueTable = new KeyValueTable({name: 'test'});

        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyValueTable.parse(handleRequest, []);
        expect(handleRequest.app.$cms.test).toStrictEqual({});
    });

    test('with valid values', () => {
        const keyValueTable = new KeyValueTable({name: 'test'});

        expect(handleRequest.app.$cms.test).toBeUndefined();
        keyValueTable.parse(handleRequest, [
            [ 'keys', 'values' ], [ 'key1', 'value1' ],
        ]);
        expect(handleRequest.app.$cms.test).toStrictEqual({
            key1: 'value1',
        });
    });
});
