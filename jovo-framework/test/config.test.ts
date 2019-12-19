import { BasicLogging } from '../src';
import { App } from './../src/App';

process.env.NODE_ENV = 'UNIT_TEST';

let app: App;
jest.setTimeout(250);

test('test basics', () => {
  app = new App({
    logging: true,
  });

  expect(app.config.plugin!.BasicLogging!.logging).toBe(true);
  expect((app.$plugins.get('BasicLogging') as BasicLogging)!.config!.logging).toBe(true);

  app.config.plugin!.BasicLogging!.logging = false;
  expect(app.config.plugin!.BasicLogging!.logging).toBe(false);
  expect((app.$plugins.get('BasicLogging') as BasicLogging)!.config!.logging).toBe(false);
});

test('test logging', () => {
  app = new App({
    logging: true,
  });

  expect(app.config.logging).toBe(true);
  expect(app.config.plugin!.BasicLogging!.logging).toBe(true);
  expect(app.config.plugin!.BasicLogging!.request).toBe(true);
  expect(app.config.plugin!.BasicLogging!.response).toBe(true);

  app = new App({
    logging: false,
  });

  expect(app.config.logging).toBe(false);
  expect(app.config.plugin!.BasicLogging!.logging).toBe(false);
  expect(app.config.plugin!.BasicLogging!.request).toBe(false);
  expect(app.config.plugin!.BasicLogging!.response).toBe(false);

  app = new App({
    logging: {
      request: true,
      requestObjects: ['a', 'b'],
      response: false,
      responseObjects: ['c', 'd'],
    },
  });

  expect(typeof app.config.logging).toBe('object');

  expect(app.config.plugin!.BasicLogging!.requestObjects).toEqual(
    expect.arrayContaining(['a', 'b']),
  );
  expect(app.config.plugin!.BasicLogging!.responseObjects).toEqual(
    expect.arrayContaining(['c', 'd']),
  );

  expect(app.config.plugin!.BasicLogging!.request).toBe(true);
  expect(app.config.plugin!.BasicLogging!.response).toBe(false);
});

test('test user', () => {
  app = new App({
    user: {
      context: true,
      metaData: true,
    },
  });
  expect(app.config.plugin!.JovoUser.context.enabled).toBe(true);
  expect(app.config.plugin!.JovoUser.metaData.enabled).toBe(true);

  app = new App({
    user: {
      implicitSave: false,
    },
  });
  expect(app.config.plugin!.JovoUser.implicitSave).toBe(false);
});
test('test inputMap', () => {
  app = new App({
    inputMap: {
      a: 'b',
    },
  });
  expect(app.config.inputMap).toEqual(expect.objectContaining({ a: 'b' }));
});
test('test intentMap', () => {
  app = new App({
    intentMap: {
      IntentA: 'IntentB',
    },
    intentsToSkipUnhandled: ['IntentX', 'IntentY'],
  });
  expect(app.config.plugin!.Router!.intentMap).toEqual(
    expect.objectContaining({ IntentA: 'IntentB' }),
  );

  expect(app.config.plugin!.Router!.intentsToSkipUnhandled).toEqual(
    expect.arrayContaining(['IntentX', 'IntentY']),
  );
});

test('test intentMap', () => {
  app = new App({
    intentMap: {
      IntentA: 'IntentB',
    },
    intentsToSkipUnhandled: ['IntentX', 'IntentY'],
  });
  expect(app.config.plugin!.Router!.intentMap).toEqual(
    expect.objectContaining({ IntentA: 'IntentB' }),
  );

  expect(app.config.plugin!.Router!.intentsToSkipUnhandled).toEqual(
    expect.arrayContaining(['IntentX', 'IntentY']),
  );
});

test('test i18n', () => {
  app = new App({
    i18n: {
      resources: {
        'en-US': {
          translation: {
            WELCOME: 'Hello World',
          },
        },
      },
    },
  });
  expect(app.config.plugin!.I18Next!.resources).toEqual(
    expect.objectContaining({
      'en-US': {
        translation: {
          WELCOME: 'Hello World',
        },
      },
    }),
  );

  app = new App({
    i18n: {
      filesDir: './dir',
    },
  });
  expect(app.config.plugin!.I18Next!.filesDir).toEqual('./dir');
});
