import { BaseApp, ErrorCode, JovoError } from 'jovo-core';
import { AirtableCMS, DefaultTable } from '../src';
import { MockHandleRequest } from './mockObj/mockHR';

process.env.NODE_ENV = 'UNIT_TEST';

let handleRequest: MockHandleRequest;
beforeEach(() => {
  handleRequest = new MockHandleRequest();
});

describe('DefaultTable.constructor()', () => {
  test('without config', () => {
    const defaultTable = new DefaultTable();
    expect(defaultTable.config.caching).toBeTruthy();
  });

  test('with config', () => {
    // TODO selectOptions maybe not required?
    const defaultTable = new DefaultTable({ caching: false });
    expect(defaultTable.config.caching).toBeFalsy();
  });
});

describe('DefaultTable.install()', () => {
  test('should set this.cms to parameter extensible', () => {
    const airtableCMS = new AirtableCMS();
    const defaultTable = new DefaultTable();
    defaultTable.install(airtableCMS);
    expect(defaultTable.cms).toStrictEqual(airtableCMS);
  });

  test('should register middleware on retrieve', () => {
    const airtableCMS = new AirtableCMS();
    const defaultTable = new DefaultTable();

    let fn;
    fn = airtableCMS.middleware('retrieve')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeUndefined();

    defaultTable.install(airtableCMS);

    fn = airtableCMS.middleware('retrieve')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeDefined();
  });

  test('should set this.config.table with constructor.config.table', () => {
    const airtableCMS = new AirtableCMS();
    const defaultTable = new DefaultTable({ table: 'test' });
    defaultTable.install(airtableCMS);
    expect(defaultTable.config.table).toMatch('test');
  });

  test('should set this.config.table with constructor.config.name', () => {
    const airtableCMS = new AirtableCMS();
    const defaultTable = new DefaultTable({ name: 'test' });
    defaultTable.install(airtableCMS);
    expect(defaultTable.config.table).toMatch('test');
  });

  test('caching on parent', () => {
    const app = new BaseApp();
    const airtableCMS = new AirtableCMS({ caching: false, apiKey: 'test', baseId: '123' });
    const defaultTable = new DefaultTable();

    airtableCMS.install(app);

    let fn;
    fn = app.middleware('request')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeUndefined();

    defaultTable.install(airtableCMS);

    fn = app.middleware('request')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeDefined();
  });

  test('caching', () => {
    const app = new BaseApp();
    const airtableCMS = new AirtableCMS({ apiKey: 'test', baseId: '123' });
    const defaultTable = new DefaultTable({ caching: false });

    airtableCMS.install(app);

    let fn;
    fn = app.middleware('request')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeUndefined();

    defaultTable.install(airtableCMS);

    fn = app.middleware('request')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeDefined();
  });
});

describe('DefaultTable.parse()', () => {
  test('should set handleRequest values to param values', () => {
    const defaultTable = new DefaultTable({ selectOptions: {}, name: 'test' });

    expect(handleRequest.app.$cms.test).toBeUndefined();

    defaultTable.parse(handleRequest, {});

    expect(handleRequest.app.$cms.test).toStrictEqual({});
  });
});

describe('DefaultTable.retrieve', () => {
  test('should throw error if this.cms is not set', () => {
    const defaultTable = new DefaultTable();
    expect(defaultTable.retrieve(handleRequest)).rejects.toStrictEqual(
      new JovoError('no cms initialized', ErrorCode.ERR_PLUGIN),
    );
  });

  test('should throw error if config.table is not set', () => {
    const airtableCMS = new AirtableCMS();
    const defaultTable = new DefaultTable();
    defaultTable.install(airtableCMS);

    expect(defaultTable.retrieve(handleRequest)).rejects.toStrictEqual(
      new JovoError('table has to be set', ErrorCode.ERR_PLUGIN),
    );
  });

  test('should throw error if config.name is not set', () => {
    const airtableCMS = new AirtableCMS();
    const defaultTable = new DefaultTable({ table: 'test', selectOptions: {} });
    defaultTable.install(airtableCMS);

    expect(defaultTable.retrieve(handleRequest)).rejects.toStrictEqual(
      new JovoError('name has to be set', ErrorCode.ERR_PLUGIN),
    );
  });

  test('should call loadTableData() and set values with parse()', async () => {
    const airtableCMS = new AirtableCMS();
    const defaultTable = new DefaultTable({ table: 'table', name: 'test', selectOptions: {} });
    defaultTable.install(airtableCMS);

    airtableCMS.loadTableData = jest.fn().mockResolvedValue({});

    expect(handleRequest.app.$cms.test).toBeUndefined();

    await defaultTable.retrieve(handleRequest);

    expect(handleRequest.app.$cms.test).toStrictEqual({});
  });
});
