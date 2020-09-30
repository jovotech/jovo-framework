import {
  HandleRequest,
  JovoRequest,
  TestSuite,
  SessionConstants,
  Jovo,
  EnumRequestType,
  LogLevel,
} from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import _set = require('lodash.set');
import { GoogleAssistant } from '../src/GoogleAssistant';

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);
const delay = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

beforeEach(() => {
  app = new App();
  const ga = new GoogleAssistant();
  app.use(ga);
  t = ga.makeTestSuite();
});

describe('test selection functionality', () => {
  test('add list to response object', async (done) => {
    app.setHandler({
      LAUNCH() {
        // skip this
        this.tell('LAUNCH');
      },
    });
    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest: HandleRequest) => {
      done();
    });
  });
});
