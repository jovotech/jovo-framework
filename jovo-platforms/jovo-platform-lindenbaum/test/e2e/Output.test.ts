import {
  EnumRequestType,
  HandleRequest,
  Jovo,
  JovoRequest,
  LogLevel,
  SessionConstants,
  TestSuite,
} from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { FileDb2 } from 'jovo-db-filedb';
import { Lindenbaum } from '../../src';
import { LindenbaumMockNlu } from './helper/LindenbaumMockNlu';
import { PATH_TO_DB_DIR, clearDbFolder } from './helper/Utils';

// LindenbaumRequest can be used to add NLU data only if the NODE_ENV is set to "UNIT_TEST"
process.env.NODE_ENV = 'UNIT_TEST';

let app: App;
let t: TestSuite;
jest.setTimeout(550);

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

describe('test tell', () => {
  test('tell plain text', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.tell('Hello World!');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isTell('Hello World!')).toBe(true);
      done();
    });
  });

  test('tell speechbuilder', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$speech.addText('Hello World!');
        this.tell(this.$speech);
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isTell('Hello World!')).toBe(true);
      done();
    });
  });

  test('tell ssml', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.tell('<speak>Hello <break time="100ms"/></speak>');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isTell('Hello <break time="100ms"/>')).toBe(true);
      done();
    });
  });
});

describe('test ask', () => {
  test('ask plain text', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.ask('Hello World!', 'Reprompt');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isAsk('Hello World!', 'Reprompt')).toBe(true);
      done();
    });
  });

  test('ask speechbuilder', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$speech.addText('Hello World!');
        this.$reprompt.addText('Reprompt!');
        this.ask(this.$speech, this.$reprompt);
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isAsk('Hello World!')).toBe(true);
      done();
    });
  });

  test('ask ssml', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.ask(
          '<speak>Hello <break time="100ms"/></speak>',
          '<speak>Reprompt <break time="100ms"/></speak>',
        );
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isAsk('Hello <break time="100ms"/>')).toBe(true);
      done();
    });
  });
});
