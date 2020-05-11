import { HandleRequest, JovoRequest, LogLevel, TestSuite } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { FileDb2 } from 'jovo-db-filedb';
import { Lindenbaum } from '../../src';
import { LindenbaumMockNlu } from './helper/LindenbaumMockNlu';
import { clearDbFolder, setDbSessionData } from './helper/Utils';

// LindenbaumRequest can be used to add NLU data only if the NODE_ENV is set to "UNIT_TEST"
process.env.NODE_ENV = 'UNIT_TEST';

let app: App;
let t: TestSuite;
jest.setTimeout(550);
const delay = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

/**
 * DUMMY REQUESTS:
 * While other FrameworkBase test files use the default ExpressJS.dummyRequest,
 * that won't work with Lindenbaum. The integration uses 3 different endpoints, with the
 * endpoint determining what kind of request it is (LAUNCH, INTENT, END).
 * The request type is determined in the framework by checking
 * which endpoint the request was sent to.
 * Because of that we extend the ExpressJS class and add
 * `dummyLaunchRequest`, `dummyIntentRequest` and `dummyEndRequest`.
 * Each one of them adds a header to the request with the correct endpoint.
 * You can find the class in `test/helper/LindenbaumExpressJS.ts`
 *
 * NLU:
 * We use a mock NLU to process the NLU data added to the requests. That's only done for the integration's own tests.
 * When the integration is used in production, one can use the project's NLU.
 *
 * DB:
 * Since Lindenbaum doesn't allow session attributes in the request/response, we use a DB.
 */

const PATH_TO_DB_DIR = './test/db';

beforeEach(() => {
  app = new App();
  const lindenbaum = new Lindenbaum();
  lindenbaum.response = jest.fn(); // mock function so no actual API calls are made
  lindenbaum.use(new LindenbaumMockNlu());
  app.use(
    lindenbaum,
    new FileDb2({
      path: PATH_TO_DB_DIR,
    }),
  );
  t = lindenbaum.makeTestSuite();
});

afterAll(() => {
  clearDbFolder();
});

describe('test $inputs', () => {
  test('test getInput, $inputs', async (done) => {
    app.setHandler({
      HelloWorldIntent() {
        expect(this.getInput('name')!.value).toBe('Joe');
        expect(this.$inputs!.name.value).toBe('Joe');
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent', {
      name: 'Joe',
    });
    app.handle(ExpressJS.dummyRequest(intentRequest));
  });

  test('test mapInputs', async (done) => {
    app.setConfig({
      inputMap: {
        'given-name': 'name',
      },
    });
    app.setHandler({
      HelloWorldIntent() {
        expect(this.getInput('name')!.value).toBe('Joe');
        expect(this.$inputs!.name.value).toBe('Joe');
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent', {
      'given-name': 'Joe',
    });
    app.handle(ExpressJS.dummyRequest(intentRequest));
  }, 100);
});

describe('test intentMap', () => {
  test('test inputMap', async (done) => {
    app.setConfig({
      intentMap: {
        HelloWorldIntent: 'MappedHelloWorldIntent',
      },
    });
    app.setHandler({
      MappedHelloWorldIntent() {
        expect(true).toBe(true);
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));
  }, 100);

  test('test inputMap with predefined handler path', async (done) => {
    app.setConfig({
      intentMap: {
        'Stop.Intent': 'END',
      },
    });
    app.setHandler({
      END() {
        expect(true).toBe(true);
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('Stop.Intent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));
  }, 100);
});

describe('test $data', () => {
  test('test different scopes', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$app.$data.appData = 'appData';
        this.$data.thisData = 'thisData';
        this.$session!.$data.sessionData = 'sessionData';
        this.toIntent('HelloWorldIntent');
      },
      HelloWorldIntent() {
        this.ask('foo', 'bar');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$app.$data.appData).toBe('appData');
      expect(handleRequest.jovo!.$data.thisData).toBe('thisData');
      expect(handleRequest.jovo!.$session.$data.sessionData).toBe('sessionData');
      done();
    });
  });
});

describe('test session attributes', () => {
  test('test get session', async (done) => {
    app.setHandler({
      SessionIntent() {
        expect(this.getSessionAttribute('sessionName1')).toBe('sessionValue1');
        expect(this.$session!.$data.sessionName2).toBe('sessionValue2');

        this.ask('Foo', 'Bar');
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('SessionIntent', {});
    setDbSessionData(intentRequest.getUserId(), {
      sessionName1: 'sessionValue1',
      sessionName2: 'sessionValue2',
    });

    app.handle(ExpressJS.dummyRequest(intentRequest));
  });

  test('test set session', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.setSessionAttribute('sessionName1', 'sessionValue1');
        this.addSessionAttribute('sessionName2', 'sessionValue2');
        this.$session!.$data.sessionName3 = 'sessionValue3';
        this.ask('Foo', 'Bar');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$session.$data['sessionName1']).toBe('sessionValue1');
      expect(handleRequest.jovo!.$session.$data['sessionName2']).toBe('sessionValue2');
      expect(handleRequest.jovo!.$session.$data['sessionName3']).toBe('sessionValue3');
      done();
    });
  });

  test('test setSessionAttributes', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.setSessionAttributes({
          sessionName1: 'sessionValue1',
          sessionName2: 'sessionValue2',
          sessionName3: 'sessionValue3',
        });
        this.ask('Foo', 'Bar');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$session.$data['sessionName1']).toBe('sessionValue1');
      expect(handleRequest.jovo!.$session.$data['sessionName2']).toBe('sessionValue2');
      expect(handleRequest.jovo!.$session.$data['sessionName3']).toBe('sessionValue3');
      done();
    });
  });
});

describe('test app listener', () => {
  test('test onRequest', async (done) => {
    app.setHandler({
      // tslint:disable-next-line
      LAUNCH() {},
    });
    app.onRequest((handleRequest: HandleRequest) => {
      expect(handleRequest.jovo).toBeUndefined();
      expect(handleRequest.host.$request).toBeDefined();

      done();
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
  });

  test('test onResponse', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.tell('Hello World!');
      },
    });
    app.onResponse((handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isTell('Hello World!')).toBe(true);
      done();
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
  });

  test('test onFail', async (done) => {
    expect.assertions(1);
    // @ts-ignore
    process.env.JOVO_LOG_LEVEL = LogLevel.NONE;
    app.setHandler({
      LAUNCH() {
        throw new Error('Error ABC');
      },
    });

    app.onFail((handleRequest: HandleRequest) => {
      expect(handleRequest.error!.message).toBe('Error ABC');
      done();
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
  });

  test('test onError', async (done) => {
    expect.assertions(1);
    // @ts-ignore
    process.env.JOVO_LOG_LEVEL = LogLevel.NONE;
    app.setHandler({
      LAUNCH() {
        throw new Error('Error ABC');
      },
    });

    app.onError((handleRequest: HandleRequest) => {
      expect(handleRequest.error!.message).toBe('Error ABC');
      done();
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
  });
});

describe('test app config', () => {
  test('test keepSessionDataOnSessionEnded (default = false) ', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$session.$data.foo = 'bar';
        this.tell('Hello World!');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.hasSessionAttribute('foo')).toBe(false);
      done();
    });
  });
  test('test keepSessionDataOnSessionEnded (true) ', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$session.$data.foo = 'bar';
        this.tell('Hello World!');
      },
    });
    // @ts-ignore
    app.config.keepSessionDataOnSessionEnded = true;

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$session.$data.foo).toBe('bar');
      done();
    });
  });
});
