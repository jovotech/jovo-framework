import { ObjectArraySheet, GoogleSheetsCMS } from '../src/';
import { HandleRequest, BaseApp, Cms, ErrorCode } from 'jovo-core';
import * as sheetValues from './mockObj/sheetValues.json';

describe('KeyValue.constructor()', () => {
    test('without config', () => {
        const objectArraySheet = new ObjectArraySheet();
        expect(objectArraySheet.config.range).toMatch('A:B');
    });

    test('with config', () => {
        const objectArraySheet = new ObjectArraySheet({
            range: 'A:Z'
        });
        expect(objectArraySheet.config.range).toMatch('A:Z');
    });
});

describe('KeyValueSheet.parse()', () => {

    test('should throw error if entity is not set', () => {
        const objectArraySheet = new ObjectArraySheet();
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

        expect(() => objectArraySheet.parse(mockHR, []))
            .toThrow('Entity has to be set.');
    });

    test('with empty array', () => {
        const objectArraySheet = new ObjectArraySheet({
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
        objectArraySheet.parse(mockHR, []);
        expect(mockHR.app.$cms.test).toStrictEqual([]);
    });

    test('with valid values', () => {
        const objectArraySheet = new ObjectArraySheet({
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
        objectArraySheet.parse(mockHR, [
            ['keys', 'values'], ['key1', 'value1']
        ]);
        expect(mockHR.app.$cms.test).toStrictEqual([
            {
                keys: 'key1',
                values: 'value1'
            }
        ]);
    });
})