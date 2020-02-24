import * as i18n from 'i18next';

import { BaseApp, Cms, HandleRequest } from 'jovo-core';
import _cloneDeep = require('lodash.clonedeep');

import { GoogleSheetsCMS, ResponsesSheet } from '../src/';

import * as cI18nModel from './mockObj/i18nModel.json';
import { MockHandleRequest } from './mockObj/mockHR';
import * as cPrivateSheetValues from './mockObj/privateSheetValues.json';
import * as cPublicSheetValues from './mockObj/publicSheetValues.json';

process.env.NODE_ENV = 'UNIT_TEST';

let publicSheetValues: any[]; // tslint:disable-line
let privateSheetValues: any[]; // tslint:disable-line
let i18nModel: any; // tslint:disable-line
let handleRequest: HandleRequest;
beforeEach(() => {
  handleRequest = new MockHandleRequest();
  publicSheetValues = _cloneDeep(cPublicSheetValues);
  privateSheetValues = _cloneDeep(cPrivateSheetValues);
  i18nModel = _cloneDeep(cI18nModel);
});

describe('ResponsesSheet.constructor()', () => {
  test('without config', () => {
    const responsesSheet = new ResponsesSheet();
    expect(responsesSheet.config.range).toMatch('A:Z');
  });

  test('with config', () => {
    const responsesSheet = new ResponsesSheet({
      range: 'A:B',
    });

    expect(responsesSheet.config.range).toMatch('A:B');
  });
});

describe('ResponsesSheet.install()', () => {
  test('should register Cms.t()', () => {
    const googleSheetsCMS = new GoogleSheetsCMS();
    const responsesSheet = new ResponsesSheet();

    responsesSheet.install(googleSheetsCMS);
    expect(new Cms().t).toBeInstanceOf(Function);
  });
});

describe('ResponsesSheet.parse()', () => {
  test('should throw error if entity is not set', () => {
    const responsesSheet = new ResponsesSheet();
    expect(() => responsesSheet.parse(handleRequest, publicSheetValues)).toThrow(
      'entity has to be set.',
    );
  });

  test('without headers and without values', () => {
    const responsesSheet = new ResponsesSheet({
      name: 'test',
    });

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    responsesSheet.parse(handleRequest, []);

    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual({});
  });

  test('without headers', () => {
    const responsesSheet = new ResponsesSheet({
      name: 'test',
    });

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    publicSheetValues.shift();
    responsesSheet.parse(handleRequest, publicSheetValues);

    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual({});
  });

  test('without values', () => {
    const responsesSheet = new ResponsesSheet({
      name: 'test',
    });

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    publicSheetValues = [publicSheetValues[0]];
    responsesSheet.parse(handleRequest, publicSheetValues);

    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual({});
  });

  test('with valid public spreadsheet values', () => {
    const responsesSheet = new ResponsesSheet({
      name: 'test',
    });

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    responsesSheet.parse(handleRequest, publicSheetValues);

    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
  });

  test('with valid private spreadsheet values', () => {
    const responsesSheet = new ResponsesSheet({
      name: 'test',
    });

    expect(handleRequest.app.$cms.I18Next).toBeUndefined();
    expect(handleRequest.app.$cms.test).toBeUndefined();

    responsesSheet.parse(handleRequest, privateSheetValues);

    expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
    expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
  });

  test('should merge new values in existing i18n object', () => {
    const responsesSheet = new ResponsesSheet({
      name: 'test',
    });
    // @ts-ignore
    i18n.init({
      interpolation: {
        escapeValue: false,
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

    responsesSheet.parse(handleRequest, publicSheetValues);

    expect(handleRequest.app.$cms.I18Next.i18n.store.data).toStrictEqual(i18nModel);
  });

  describe('with platform-specific responses', () => {
    test('with private spreadsheet values', () => {
      const app = new BaseApp();
      const googleSheetsCMS = new GoogleSheetsCMS();
      googleSheetsCMS.install(app);
      const responsesSheet = new ResponsesSheet({
        name: 'test',
      });
      responsesSheet.install(googleSheetsCMS);
      handleRequest.app.getAppTypes = () => {
        return ['AlexaSkill'];
      };

      expect(handleRequest.app.$cms.I18Next).toBeUndefined();
      expect(handleRequest.app.$cms.test).toBeUndefined();

      privateSheetValues[0].push('en-US-AlexaSkill');
      privateSheetValues[1].push('Welcome_Alexa');
      i18nModel['en-US'].AlexaSkill = {
        translation: {
          WELCOME: 'Welcome_Alexa',
        },
      };
      responsesSheet.parse(handleRequest, privateSheetValues);

      // @ts-ignore
      expect(app.config.platformSpecificResponses).toBeTruthy();
      expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
      expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
    });

    test('with public spreadsheet values', () => {
      const app = new BaseApp();
      const googleSheetsCMS = new GoogleSheetsCMS();
      googleSheetsCMS.install(app);
      const responsesSheet = new ResponsesSheet({
        name: 'test',
      });
      responsesSheet.install(googleSheetsCMS);
      handleRequest.app.getAppTypes = () => {
        return ['AlexaSkill'];
      };

      expect(handleRequest.app.$cms.I18Next).toBeUndefined();
      expect(handleRequest.app.$cms.test).toBeUndefined();

      publicSheetValues[0].push('en-us-alexaskill');
      publicSheetValues[1].push('Welcome_Alexa');
      i18nModel['en-US'].AlexaSkill = {
        translation: {
          WELCOME: 'Welcome_Alexa',
        },
      };
      responsesSheet.parse(handleRequest, publicSheetValues);

      // @ts-ignore
      expect(app.config.platformSpecificResponses).toBeTruthy();
      expect(handleRequest.app.$cms.I18Next.i18n).toBeDefined();
      expect(handleRequest.app.$cms.test).toStrictEqual(i18nModel);
    });
  });
});
