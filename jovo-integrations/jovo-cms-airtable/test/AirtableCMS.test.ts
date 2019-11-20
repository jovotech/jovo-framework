import { BaseApp } from 'jovo-core';
import { AirtableCMS } from '../src';

process.env.NODE_ENV = 'UNIT_TEST';

describe('AirtableCMS.constructor()', () => {
  test('without config', () => {
    const airtableCMS = new AirtableCMS();
    expect(airtableCMS.config.caching).toBeTruthy();
  });

  test('with config', () => {
    const airtableCMS = new AirtableCMS({ caching: false });
    expect(airtableCMS.config.caching).toBeFalsy();
  });

  test('should register "this" in ActionSet on "retrieve"', () => {
    const airtableCMS = new AirtableCMS();
    expect(airtableCMS.actionSet.get('retrieve')!.parent).toStrictEqual(airtableCMS);
  });
});

describe('AirtableCMS.install()', () => {
  test('should throw jovo error if apiKey is not defined', () => {
    const app = new BaseApp();
    const airtableCMS = new AirtableCMS();
    expect(() => airtableCMS.install(app)).toThrow(`Can't find api key`);
  });

  test('should throw jovo error if baseId is not defined', () => {
    const app = new BaseApp();
    // TODO tables always required??
    const airtableCMS = new AirtableCMS({ apiKey: '123' });
    expect(() => airtableCMS.install(app)).toThrow(`Can't find baseId`);
  });

  test('should assign parameter "app" to "this.baseApp"', () => {
    const app = new BaseApp();
    const airtableCMS = new AirtableCMS({ apiKey: '123', baseId: '234' });
    airtableCMS.install(app);
    expect(airtableCMS.baseApp).toStrictEqual(app);
  });

  test('should register middleware on setup', () => {
    const app = new BaseApp();
    const airtableCMS = new AirtableCMS({ apiKey: '123', baseId: '234' });

    let fn;
    fn = app.middleware('setup')!.fns.find((i) => i.name === 'bound retrieveAirtableData');
    expect(fn).toBeUndefined();

    airtableCMS.install(app);

    fn = app.middleware('setup')!.fns.find((i) => i.name === 'bound retrieveAirtableData');
    expect(fn).toBeDefined();
  });

  test('should install default table', async () => {
    const app = new BaseApp();
    const airtableCMS = new AirtableCMS({
      apiKey: '123',
      baseId: '234',
      tables: [
        {
          name: 'test',
        },
      ],
    });

    let fn;
    fn = airtableCMS.middleware('retrieve')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeUndefined();

    await airtableCMS.install(app);

    fn = airtableCMS.middleware('retrieve')!.fns.find((i) => i.name === 'bound retrieve');
    expect(fn).toBeDefined();
  });
});
