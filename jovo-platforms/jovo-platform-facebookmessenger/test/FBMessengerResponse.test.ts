import { MessengerBotRequest, FacebookMessenger, MessengerBot, Message } from '../src';
import { App, ExpressJS, JovoRequest, EnumRequestType } from 'jovo-framework';
import { TestSuite, Conversation, HandleRequest } from 'jovo-core';

const multipleEventRequest = require('../sample-request-json/v1/MultipleEventRequest.json');

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;

describe('response', () => {
  beforeAll(() => {
    // Let's make Message.send noop as we don't need to make calls to fb
    Message.prototype.send = jest.fn().mockImplementation(() => {});
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    app = new App();

    const messenger = new FacebookMessenger({
      fetchUserProfile: false,
      shouldOverrideAppHandle: true,
    });

    app.use(messenger);
    t = messenger.makeTestSuite();
  });

  test('single request', async (done) => {
    app.setHandler({
      LAUNCH_TEST() {
        // Single fb api call
        this.$messengerBot?.tell('hello');
      },
    });
    const req = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(req));

    app.on('response', (handleRequest: HandleRequest) => {
      const messengerResponse = handleRequest.jovo!.$response;
      expect(messengerResponse).toMatchObject({
        message: [
          {
            message: { quick_replies: undefined, text: 'hello world' },
            message_type: 'RESPONSE',
            recipient: { id: '2321893584590078' },
          },
        ],
      });
      done();
    });
  });

  test('multiple responses', async (done) => {
    app.setHandler({
      LAUNCH_TEST() {
        // Two fb api calls
        this.$messengerBot?.showText({
          text: 'hello world 1',
        });
        this.$messengerBot?.showText({
          text: 'hello world 2',
        });
      },
    });

    const request: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(request));

    app.on('response', (handleRequest: HandleRequest) => {
      const messengerResponses = handleRequest.jovo!.$response;
      expect(messengerResponses).toMatchObject({
        message: [
          {
            message: { quick_replies: undefined, text: 'hello world 1' },
            message_type: 'RESPONSE',
            recipient: { id: '2321893584590078' },
          },
          {
            message: { quick_replies: undefined, text: 'hello world 2' },
            message_type: 'RESPONSE',
            recipient: { id: '2321893584590078' },
          },
        ],
      });
      done();
    });
  });

  test('multiple events', async (done) => {
    app.setHandler({
      INTENT_1() {
        this.$messengerBot?.showText({
          text: 'hello world 1',
        });
      },
      INTENT_2() {
        this.$messengerBot?.showText({
          text: 'hello world 2',
        });
      },
    });

    // Request will call INTENT_1 and INTENT_2 in one call
    const request: JovoRequest = await t.requestBuilder.launch(multipleEventRequest);
    app.handle(ExpressJS.dummyRequest(request));

    // This hook should be called twice since there are two events are called
    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      const request: any = handleRequest.jovo?.$request;

      const intentName = request.messaging[0].postback.payload;

      if (intentName === 'INTENT_1') {
        expect(response).toMatchObject({
          message: [
            {
              message: { quick_replies: undefined, text: 'hello world 1' },
              message_type: 'RESPONSE',
              recipient: { id: '2321893584590078' },
            },
          ],
        });
      } else if (intentName === 'INTENT_2') {
        expect(response).toMatchObject({
          message: [
            {
              message: { quick_replies: undefined, text: 'hello world 2' },
              message_type: 'RESPONSE',
              recipient: { id: '2321893584590078' },
            },
          ],
        });
      }

      done();
    });
  });
});
