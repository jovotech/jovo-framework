import * as i18n from 'i18next';

import { BaseApp, Cms, HandleRequest } from 'jovo-core';
import _cloneDeep = require('lodash.clonedeep');

import { AirtableCMS, ResponsesTable } from '../src';
import * as cI18nModel from './mockObj/i18nModel.json';
import { MockHandleRequest } from './mockObj/mockHR';
import * as cTableValues from './mockObj/tableValues.json';

process.env.NODE_ENV = 'UNIT_TEST';

let tableValues: any[]; // tslint:disable-line
let i18nModel: any; // tslint:disable-line
let handleRequest: HandleRequest;
beforeEach(() => {
  handleRequest = new MockHandleRequest();
  tableValues = _cloneDeep(cTableValues);
  i18nModel = _cloneDeep(cI18nModel);
});

describe('ResponsesTable.constructor()', () => {
  test('without config', () => {
    const responsesTable = new ResponsesTable();
    expect(responsesTable.config.enabled).toBeTruthy();
  });

  test('with config', () => {
    const responsesTable = new ResponsesTable({ enabled: false });
    expect(responsesTable.config.enabled).toBeFalsy();
  });
});

describe('ResponsesTable.install()', () => {
  test('should register Cms.t()', () => {
    const airtableCMS = new AirtableCMS();
    const responsesTable = new ResponsesTable();

    responsesTable.install(airtableCMS);
    expect(new Cms().t).toBeInstanceOf(Function);
  });
});

describe('ResponsesTable.parse()', () => {
  test('should throw error if name is not set', () => {
    const responsesTable = new ResponsesTable();
    expect(() => responsesTable.parse(handleRequest, [])).toThrow('name has to be set');
  });

  test('without headers and without values', () => {
    const responsesTable = new ResponsesTable({ name: 'test' });

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    responsesTable.parse(handleRequest, []);

    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual({});
  });

  test('without headers', () => {
    const responsesTable = new ResponsesTable({
      name: 'test',
    });

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    tableValues.shift();
    responsesTable.parse(handleRequest, tableValues);

    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual({});
  });

  test('without values', () => {
    const responsesTable = new ResponsesTable({
      name: 'test',
    });

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    tableValues = [tableValues[0]];
    responsesTable.parse(handleRequest, tableValues);

    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual({});
  });

  test('with valid values', () => {
    const responsesTable = new ResponsesTable({
      name: 'test',
    });

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    responsesTable.parse(handleRequest, tableValues);

    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
  });

  test('should merge new values in existing i18n object', () => {
    const responsesTable = new ResponsesTable({
      name: 'test',
    });

    // @ts-ignore
    i18n.init({
      interpolation: {
        escapeValue: false, // do not escape ssml tags
      },
      load: 'all',
      resources: {
        'en-US': {
          translation: {
            WELCOME: ['Welcome'],
          },
        },
      },
      returnObjects: true,
    });

    handleRequest.app.$cms.I18Next = { i18n };

    expect(handleRequest.app.$cms.I18Next.i18n.store.data).toStrictEqual({
      'en-US': {
        translation: {
          WELCOME: ['Welcome'],
        },
      },
    });

    responsesTable.parse(handleRequest, tableValues);

    expect(handleRequest.app.$cms.I18Next.i18n.store.data).toStrictEqual(i18nModel);
  });

  test('with platform-specific responses', () => {
    const app = new BaseApp();
    const airtableCMS = new AirtableCMS({ apiKey: '123', baseId: '234' });
    airtableCMS.install(app);
    const responsesTable = new ResponsesTable({
      name: 'test',
    });
    responsesTable.install(airtableCMS);
    handleRequest.app.getAppTypes = () => {
      return ['AlexaSkill'];
    };

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    tableValues[0].push('en-US-AlexaSkill');
    tableValues[1].push('Welcome_Alexa');
    i18nModel['en-US'].AlexaSkill = {
      translation: {
        WELCOME: ['Welcome_Alexa'],
      },
    };
    responsesTable.parse(handleRequest, tableValues);

    // @ts-ignore
    expect(app.config.platformSpecificResponses).toBeTruthy();
    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
  });
});
