import { HandleRequest } from 'jovo-core';
import { FileDb2 } from 'jovo-db-filedb';
import { App, ExpressJS } from 'jovo-framework';
import { GoogleBusiness, GoogleBusinessRequest, GoogleBusinessTestSuite } from '../../src';
import { GoogleBusinessMockNlu } from './helper/GoogleBusinessMockNlu';
import { clearDbFolder, PATH_TO_DB_DIR } from './helper/Utils';

// GoogleBusinessRequest can be used to add NLU data only if the NODE_ENV is set to "UNIT_TEST"
process.env.NODE_ENV = 'UNIT_TEST';

let app: App;
let t: GoogleBusinessTestSuite;
jest.setTimeout(550);

/**
 * NLU:
 * We use a mock NLU to process the NLU data added to the requests. That's only done for the integration's own tests.
 * When the integration is used in production, one can use the project's NLU.
 *
 * DB:
 * Since Google Business Messages doesn't allow session attributes in the request/response, we use a DB.
 */
beforeEach(() => {
  app = new App();
  const googleBusiness = new GoogleBusiness();
  googleBusiness.response = jest.fn(); // mock function so no actual API calls are made
  googleBusiness.use(new GoogleBusinessMockNlu());
  app.use(
    googleBusiness,
    new FileDb2({
      path: PATH_TO_DB_DIR,
    }),
  );
  t = googleBusiness.makeTestSuite();
});

afterAll(() => {
  clearDbFolder();
});

describe('test tell', () => {
  test('tell plain text', async (done) => {
    app.setHandler({
      TestIntent() {
        this.tell('Hello World!');
      },
    });

    const intentRequest: GoogleBusinessRequest = await t.requestBuilder.intent('TestIntent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isTell('Hello World!')).toBe(true);
      done();
    });
  });

  test('tell speechbuilder', async (done) => {
    app.setHandler({
      TestIntent() {
        this.$speech.addText('Hello World!');
        this.tell(this.$speech);
      },
    });

    const intentRequest: GoogleBusinessRequest = await t.requestBuilder.intent('TestIntent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isTell('Hello World!')).toBe(true);
      done();
    });
  });

  test('tell ssml', async (done) => {
    app.setHandler({
      TestIntent() {
        this.tell('<speak>Hello <break time="100ms"/></speak>');
      },
    });

    const intentRequest: GoogleBusinessRequest = await t.requestBuilder.intent('TestIntent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isTell('Hello <break time="100ms"/>')).toBe(true);
      done();
    });
  });
});

describe('test ask', () => {
  test('ask plain text', async (done) => {
    app.setHandler({
      TestIntent() {
        this.ask('Hello World!', 'Reprompt');
      },
    });

    const intentRequest: GoogleBusinessRequest = await t.requestBuilder.intent('TestIntent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isAsk('Hello World!', 'Reprompt')).toBe(true);
      done();
    });
  });

  test('ask speechbuilder', async (done) => {
    app.setHandler({
      TestIntent() {
        this.$speech.addText('Hello World!');
        this.$reprompt.addText('Reprompt!');
        this.ask(this.$speech, this.$reprompt);
      },
    });

    const intentRequest: GoogleBusinessRequest = await t.requestBuilder.intent('TestIntent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isAsk('Hello World!')).toBe(true);
      done();
    });
  });

  test('ask ssml', async (done) => {
    app.setHandler({
      TestIntent() {
        this.ask(
          '<speak>Hello <break time="100ms"/></speak>',
          '<speak>Reprompt <break time="100ms"/></speak>',
        );
      },
    });

    const intentRequest: GoogleBusinessRequest = await t.requestBuilder.intent('TestIntent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isAsk('Hello <break time="100ms"/>')).toBe(true);
      done();
    });
  });
});
