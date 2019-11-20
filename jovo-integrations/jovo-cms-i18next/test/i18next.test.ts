import { BaseApp, HandleRequest } from 'jovo-core';

import { I18Next } from '../src/';
import * as i18nData from './i18n/en-US.json';
import { MockHandleRequest } from './mock/mockHR';

describe('I18Next.constructor()', () => {
  test('without config', () => {
    const i18n = new I18Next();
    expect(i18n.config.filesDir).toEqual('./i18n');
  });

  test('with config', () => {
    const i18n = new I18Next({ filesDir: '../test' });
    expect(i18n.config.filesDir).toEqual('../test');
  });
});

describe('I18Next.loadFiles()', () => {
  test('with config.filesDir', async () => {
    const i18Next = new I18Next({
      filesDir: './test/i18n/',
    });

    const mockHR = new MockHandleRequest();

    mockHR.app.getAppTypes = () => {
      return ['AlexaSkill'];
    };

    await i18Next.loadFiles(mockHR);

    // @ts-ignore
    expect(mockHR.app.config.platformSpecificResponses).toBe(true);
    expect(mockHR.app.$cms.I18Next.resources['en-US'].translation.WELCOME).toEqual(
      'Welcome_Default',
    );
    expect(mockHR.app.$cms.I18Next.resources['en-US'].AlexaSkill.translation.WELCOME).toEqual(
      'Welcome_Alexa',
    );
    expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
  });

  test('with config.resources', async () => {
    const i18Next = new I18Next({
      resources: {
        'en-US': i18nData,
      },
    });

    const mockHR = new MockHandleRequest();

    mockHR.app.getAppTypes = () => {
      return ['AlexaSkill'];
    };

    await i18Next.loadFiles(mockHR);

    // @ts-ignore
    expect(mockHR.app.config.platformSpecificResponses).toBe(true);
    expect(mockHR.app.$cms.I18Next.resources['en-US'].translation.WELCOME).toEqual(
      'Welcome_Default',
    );
    expect(mockHR.app.$cms.I18Next.resources['en-US'].AlexaSkill.translation.WELCOME).toEqual(
      'Welcome_Alexa',
    );
    expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
  });

  test('with config.resources without platform-specifics', async () => {
    const i18Next = new I18Next({
      resources: {
        'en-US': {
          translation: i18nData.translation,
        },
      },
    });

    const mockHR = new MockHandleRequest();

    mockHR.app.getAppTypes = () => {
      return ['AlexaSkill'];
    };

    await i18Next.loadFiles(mockHR);

    // @ts-ignore
    expect(mockHR.app.config.platformSpecificResponses).toBeUndefined();
    expect(mockHR.app.$cms.I18Next.resources['en-US'].translation.WELCOME).toEqual(
      'Welcome_Default',
    );
    expect(mockHR.app.$cms.I18Next.i18n).toBeDefined();
  });
});
