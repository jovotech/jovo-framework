import { HandleRequest } from 'jovo-core';
import { ObjectArrayTable } from '../src';
import { MockHandleRequest } from './mockObj/mockHR';

let handleRequest: HandleRequest;
beforeEach(() => {
  handleRequest = new MockHandleRequest();
});

describe('ObjectArrayTable.constructor()', () => {
  test('without config', () => {
    const objectArrayTable = new ObjectArrayTable();
    expect(objectArrayTable.config.enabled).toBeTruthy();
  });

  test('with config', () => {
    const objectArrayTable = new ObjectArrayTable({ enabled: false });
    expect(objectArrayTable.config.enabled).toBeFalsy();
  });
});

describe('ObjectArrayTable.parse()', () => {
  test('should throw error if name is not set', () => {
    const objectArrayTable = new ObjectArrayTable();
    expect(() => objectArrayTable.parse(handleRequest, [])).toThrow('name has to be set');
  });

  test('with empty array', () => {
    const objectArrayTable = new ObjectArrayTable({ name: 'test' });

    expect(handleRequest.app.$cms.test).toBeUndefined();
    objectArrayTable.parse(handleRequest, []);
    expect(handleRequest.app.$cms.test).toStrictEqual([]);
  });

  test('with valid values', () => {
    const objectArrayTable = new ObjectArrayTable({ name: 'test' });

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
