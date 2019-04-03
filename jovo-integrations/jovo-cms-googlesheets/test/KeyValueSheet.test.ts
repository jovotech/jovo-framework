import { KeyValueSheet } from '../src/';
import { HandleRequest, BaseApp } from 'jovo-core';

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
        const mockHR: HandleRequest = {
            app: new BaseApp(),
            host: {
                hasWriteFileAccess: true,
                headers: {},
                $request: {},
                getRequestObject() { },
                setResponse() {
                    return new Promise((res, rej) => { });
                },
                fail() { }
            }
        };

        expect(() => keyValueSheet.parse(mockHR, []))
            .toThrow('Entity has to be set.');
    });

    test('with empty array', () => {
        const keyValueSheet = new KeyValueSheet({
            name: 'test'
        });
        const mockHR: HandleRequest = {
            app: new BaseApp(),
            host: {
                hasWriteFileAccess: true,
                headers: {},
                $request: {},
                getRequestObject() {

                },
                setResponse() {
                    return new Promise((res, rej) => {

                    });
                },
                fail() {

                }
            }
        };

        expect(mockHR.app.$cms.test).toBeUndefined();
        keyValueSheet.parse(mockHR, []);
        expect(mockHR.app.$cms.test).toStrictEqual({});
    });

    test('with valid values', () => {
        const keyValueSheet = new KeyValueSheet({
            name: 'test',
            range: 'A:Z'
        });
        const mockHR: HandleRequest = {
            app: new BaseApp(),
            host: {
                hasWriteFileAccess: true,
                headers: {},
                $request: {},
                getRequestObject() {

                },
                setResponse() {
                    return new Promise((res, rej) => {

                    });
                },
                fail() {

                }
            }
        };

        expect(mockHR.app.$cms.test).toBeUndefined();
        keyValueSheet.parse(mockHR, [
            ['keys', 'values'], ['key1', 'value1']
        ]);
        expect(mockHR.app.$cms.test).toStrictEqual({
            key1: 'value1'
        });
    });
})