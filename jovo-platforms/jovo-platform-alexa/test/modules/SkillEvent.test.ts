import { HandleRequest, JovoRequest, TestSuite, SessionConstants } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { Alexa } from '../../src';
import _get = require('lodash.get');
import _set = require('lodash.set');

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);
const delay = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

beforeEach(() => {
  app = new App();
  const alexa = new Alexa();
  app.use(alexa);
  t = alexa.makeTestSuite();
});
describe('test Skill events', () => {
  test('test AlexaSkillEvent.SkillDisabled', async (done) => {
    app.setHandler({
      ON_EVENT: {
        'AlexaSkillEvent.SkillDisabled'() {
          done();
        },
      },
    });

    const audioPlayerRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
      'AlexaSkillEvent.SkillDisabled',
    );

    app.handle(ExpressJS.dummyRequest(audioPlayerRequest));
  });

  test('test AlexaSkillEvent.SkillEnabled', async (done) => {
    app.setHandler({
      ON_EVENT: {
        'AlexaSkillEvent.SkillEnabled'() {
          done();
        },
      },
    });

    const audioPlayerRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
      'AlexaSkillEvent.SkillDisabled',
    );
    _set(audioPlayerRequest, 'request.type', 'AlexaSkillEvent.SkillEnabled');

    app.handle(ExpressJS.dummyRequest(audioPlayerRequest));
  });
});
