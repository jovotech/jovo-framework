import { HandleRequest, JovoRequest, TestSuite, SessionConstants } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { Alexa } from '../../src';
import _get = require('lodash.get');

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);

beforeEach(() => {
  app = new App();
  const alexa = new Alexa();
  app.use(alexa);
  t = alexa.makeTestSuite();
});

describe('test GadgetController functions', () => {
  test('test respond', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.setSessionAttribute('myKey', 'myValue');
        this.$alexaSkill!.$gameEngine!.respond('hello');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(_get(response, 'response.outputSpeech')).toStrictEqual({
        type: 'SSML',
        ssml: '<speak>hello</speak>',
      });
      expect(_get(response, 'response.shouldEndSession')).toBeUndefined();

      // verify that session attributes are returned in response
      expect(_get(response, 'sessionAttributes')).toStrictEqual({
        myKey: 'myValue',
      });

      done();
    });
  });
});
