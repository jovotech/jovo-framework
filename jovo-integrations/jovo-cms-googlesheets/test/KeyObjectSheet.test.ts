import { HandleRequest } from 'jovo-core';

import { KeyObjectSheet } from '../src/';
import { MockHandleRequest } from './mockObj/mockHR';

let handleRequest: HandleRequest;
beforeEach(() => {
  handleRequest = new MockHandleRequest();
});

describe('KeyObjectSheet.constructor()', () => {
  test('without config', () => {
    const keyObjectSheet = new KeyObjectSheet();
    expect(keyObjectSheet.config.range).toMatch('A:C');
  });

  test('with config', () => {
    const keyObjectSheet = new KeyObjectSheet({
      range: 'A:Z',
    });
    expect(keyObjectSheet.config.range).toMatch('A:Z');
  });
});

describe('KeyObjectSheet.parse()', () => {
  test('should throw error if entity is not set', () => {
    const keyObjectSheet = new KeyObjectSheet();

    expect(() => keyObjectSheet.parse(handleRequest, [])).toThrow('entity has to be set.');
  });

  test('with empty array', () => {
    const keyObjectSheet = new KeyObjectSheet({
      name: 'test',
    });

    expect(handleRequest.app.$cms.test).toBeUndefined();
    keyObjectSheet.parse(handleRequest, []);
    expect(handleRequest.app.$cms.test).toStrictEqual({});
  });

  test('with valid values', () => {
    const keyObjectSheet = new KeyObjectSheet({
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
    const keyObjectSheet = new KeyObjectSheet({
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
