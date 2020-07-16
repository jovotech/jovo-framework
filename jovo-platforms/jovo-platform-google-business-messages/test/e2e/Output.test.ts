import { HandleRequest } from 'jovo-core';
import { FileDb2 } from 'jovo-db-filedb';
import { App, ExpressJS } from 'jovo-framework';
import { BusinessMessages, BusinessMessagesRequest, BusinessMessagesTestSuite } from '../../src';
import { BusinessMessagesMockNlu } from './helper/BusinessMessagesMockNlu';
import { clearDbFolder, PATH_TO_DB_DIR } from './helper/Utils';

// BusinessMessagesRequest can be used to add NLU data only if the NODE_ENV is set to "UNIT_TEST"
process.env.NODE_ENV = 'UNIT_TEST';

let app: App;
let t: BusinessMessagesTestSuite;
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
  const businessMessages = new BusinessMessages();
  businessMessages.response = jest.fn(); // mock function so no actual API calls are made
  businessMessages.use(new BusinessMessagesMockNlu());
  app.use(
    businessMessages,
    new FileDb2({
      path: PATH_TO_DB_DIR,
    }),
  );
  t = businessMessages.makeTestSuite();
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

    const intentRequest: BusinessMessagesRequest = await t.requestBuilder.intent('TestIntent', {});
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

    const intentRequest: BusinessMessagesRequest = await t.requestBuilder.intent('TestIntent', {});
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

    const intentRequest: BusinessMessagesRequest = await t.requestBuilder.intent('TestIntent', {});
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

    const intentRequest: BusinessMessagesRequest = await t.requestBuilder.intent('TestIntent', {});
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

    const intentRequest: BusinessMessagesRequest = await t.requestBuilder.intent('TestIntent', {});
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

    const intentRequest: BusinessMessagesRequest = await t.requestBuilder.intent('TestIntent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isAsk('Hello <break time="100ms"/>')).toBe(true);
      done();
    });
  });
});
