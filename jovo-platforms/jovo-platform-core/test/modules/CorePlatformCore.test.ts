import { HandleRequest, JovoRequest, TestSuite } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework'; // tslint:disable-line

import { CorePlatform } from '../../src';

// tslint:disable-next-line
console.log = () => {};

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(500);

beforeEach(() => {
  app = new App();
  const assistant = new CorePlatform();
  app.use(assistant);
  t = assistant.makeTestSuite();
});

describe('test requests', () => {
  test('test SessionEndedRequest', async (done) => {
    app.setHandler({
      END() {
        done();
      },
    });
    const request: JovoRequest = await t.requestBuilder.rawRequestByKey('SessionEndedRequest');
    app.handle(ExpressJS.dummyRequest(request));
  });

  test('test empty response', async (done) => {
    app.setHandler({
      // tslint:disable-next-line
      END() {},
    });
    const request: JovoRequest = await t.requestBuilder.end();
    app.handle(ExpressJS.dummyRequest(request));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(response).toEqual({
        response: {},
        sessionData: {},
        userData: {},
        version: '1.0',
      });
      done();
    });
  });
});
