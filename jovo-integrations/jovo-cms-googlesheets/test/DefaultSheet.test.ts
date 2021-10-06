import { BaseApp, ErrorCode, HandleRequest, JovoError } from 'jovo-core';
import { DefaultSheet, GoogleSheetsCMS } from '../src/';
import * as feed from './mockObj/feedEntries.json';
import { MockHandleRequest } from './mockObj/mockHR';
import * as sheetValues from './mockObj/publicSheetValues.json';

process.env.NODE_ENV = 'UNIT_TEST';

let handleRequest: HandleRequest;
beforeEach(() => {
  handleRequest = new MockHandleRequest();
});

describe('DefaultSheet.constructor()', () => {
  test('without config', () => {
    const defaultSheet = new DefaultSheet();
    expect(defaultSheet.config.caching).toBeTruthy();
    expect(defaultSheet.config.entity).toBeUndefined();
  });

  test('with config', () => {
    const defaultSheet = new DefaultSheet({
      caching: false,
    });
    expect(defaultSheet.config.caching).toBeFalsy();
    expect(defaultSheet.config.entity).toBeUndefined();
  });

  test('set entity with config.entity', () => {
    const defaultSheet = new DefaultSheet({
      entity: 'test',
    });
    expect(defaultSheet.config.entity).toMatch('test');
  });

  test('set entity with config.name', () => {
    const defaultSheet = new DefaultSheet({
      name: 'test',
    });
    expect(defaultSheet.config.entity).toMatch('test');
  });
});

describe('DefaultSheet.install()', () => {
  test('should set this.cms to parameter extensible', () => {
    const googleSheetsCMS = new GoogleSheetsCMS();
    const defaultSheet = new DefaultSheet();
    defaultSheet.install(googleSheetsCMS);

    expect(defaultSheet.cms).toStrictEqual(googleSheetsCMS);
  });

  test('should register middleware on retrieve', () => {
    const googleSheetsCMS = new GoogleSheetsCMS();
    const defaultSheet = new DefaultSheet();

    let fn;
    fn = googleSheetsCMS.middleware('retrieve')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeUndefined();

    defaultSheet.install(googleSheetsCMS);

    fn = googleSheetsCMS.middleware('retrieve')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeDefined();
  });

  test('should register middleware on request with caching on parent', () => {
    const googleSheetsCMS = new GoogleSheetsCMS({
      caching: false,
    });
    const defaultSheet = new DefaultSheet();
    const app = new BaseApp();
    googleSheetsCMS.install(app);

    let fn;
    fn = app.middleware('request')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeUndefined();

    defaultSheet.install(googleSheetsCMS);

    fn = app.middleware('request')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeDefined();
  });

  test('should register middleware on request with caching', () => {
    const googleSheetsCMS = new GoogleSheetsCMS();
    const defaultSheet = new DefaultSheet({
      caching: false,
    });
    const app = new BaseApp();
    googleSheetsCMS.install(app);

    let fn;
    fn = app.middleware('request')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeUndefined();

    defaultSheet.install(googleSheetsCMS);

    fn = app.middleware('request')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeDefined();
  });
});

describe('DefaultSheet.parse()', () => {
  test('should throw error if entity is not set', () => {
    const defaultSheet = new DefaultSheet();

    expect(() => defaultSheet.parse(handleRequest, [])).toThrow('entity has to be set.');
  });

  test('should set values to entity attribute', () => {
    const defaultSheet = new DefaultSheet({
      name: 'test',
    });

    expect(handleRequest.app.$cms.test).toBeUndefined();

    defaultSheet.parse(handleRequest, []);

    expect(handleRequest.app.$cms.test).toStrictEqual([]);
  });
});

describe('DefaultSheet.retrieve()', () => {
  test('should reject Promise if no parent is set', async () => {
    const defaultSheet = new DefaultSheet();
    await expect(defaultSheet.retrieve(handleRequest)).rejects.toMatch('No cms initialized.');
  });

  test('should reject Promise with JovoError if spreadsheet id is not set', async () => {
    const googleSheetsCMS = new GoogleSheetsCMS();
    const defaultSheet = new DefaultSheet();
    defaultSheet.install(googleSheetsCMS);

    await expect(defaultSheet.retrieve(handleRequest)).rejects.toStrictEqual(
      new JovoError('spreadsheetId has to be set.', ErrorCode.ERR_PLUGIN),
    );
  });

  test('should reject Promise with JovoError if no name is set', async () => {
    const googleSheetsCMS = new GoogleSheetsCMS();
    const defaultSheet = new DefaultSheet({
      spreadsheetId: '123',
    });
    defaultSheet.install(googleSheetsCMS);

    await expect(defaultSheet.retrieve(handleRequest)).rejects.toStrictEqual(
      new JovoError('sheet name has to be set.', ErrorCode.ERR_PLUGIN),
    );
  });
});
