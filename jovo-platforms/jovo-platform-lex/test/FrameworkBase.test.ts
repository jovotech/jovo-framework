import {
  LogLevel,
  HandleRequest,
  JovoRequest,
  TestSuite,
  SessionConstants,
  EnumRequestType,
  Jovo,
} from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { FileDb2 } from 'jovo-db-filedb';
import _set = require('lodash.set');
import * as fs from 'fs';
import * as path from 'path';

import { Lex } from '../src';

const PATH_TO_DB_DIR = './test/db';

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);
const delay = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

beforeEach(() => {
  app = new App({
    user: {
      sessionData: {
        enabled: true,
        id: true,
      },
    },
  });
  const lex = new Lex();
  app.use(
    new FileDb2({
      path: PATH_TO_DB_DIR,
    }),
    lex,
  );
  t = lex.makeTestSuite();
});

afterAll(async () => {
  /**
   * Tests finish before the last FileDb JSON file is saved in the `db` folder.
   * That resulted in JSON files still being present after tests were finished.
   * Since the tests don't depend on the JSOn files being saved, it doesn't really matter,
   * but to always keep the db folder clear,
   * we set a small delay (500ms) before we clear the folder.
   */
  await delay(500);
  clearDbFolder();
});

describe('test request types', () => {
  /*
    test('test launch', async (done) => {
     app.setHandler({
       LAUNCH() {},
     });

     const launchRequest: JovoRequest = await t.requestBuilder.launch();
     app.handle(ExpressJS.dummyRequest(launchRequest));

     app.on('response', (handleRequest: HandleRequest) => {
     //  console.log(handleRequest)
     //  expect(handleRequest.jovo!.$type.type).toBe(EnumRequestType.LAUNCH);
       done();
     });
   });
   */
  test('test intent', async (done) => {
    app.setHandler({
      HelloWorldIntent() {},
    });

    const request: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent', {});
    app.handle(ExpressJS.dummyRequest(request));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$type.type).toBe(EnumRequestType.INTENT);
      done();
    });
  });

  test('test end', async (done) => {
    app.setHandler({
      END() {
        this.tell('end');
      },
    });

    const request: JovoRequest = await t.requestBuilder.end();
    app.handle(ExpressJS.dummyRequest(request));

    app.on('response', (handleRequest: HandleRequest) => {
      // @ts-ignore
      expect(handleRequest.jovo!.$response.dialogAction.type).toBe('Close');
      done();
    });
  });

  test('test end global', async (done) => {
    app.setHandler({
      END() {
        done();
      },
    });

    const request: JovoRequest = await t.requestBuilder.end();
    request.setState('State');
    app.handle(ExpressJS.dummyRequest(request));
  });

  test('test getRoute', async (done) => {
    app.setHandler({
      HelloWorldIntent() {
        const route = this.getRoute();
        expect(route.type).toEqual('INTENT');
        expect(route.intent).toEqual('HelloWorldIntent');
        console.log(this.getUserId());
        this.$session.$data.toto = 1;
        this.$user.$data.toto = 1;
        done();
      },
    });
    const request: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent', {});
    app.handle(ExpressJS.dummyRequest(request));
    app.on('response', (handleRequest: HandleRequest) => {
      // @ts-ignore
      const lexResponse = handleRequest.jovo!.$response;
      done();
    });
  });

  test('test end in state', async (done) => {
    app.setHandler({
      State: {
        END() {
          done();
        },
      },
    });

    const request: JovoRequest = await t.requestBuilder.end();
    request.setState('State');
    app.handle(ExpressJS.dummyRequest(request));
  });

  test('test end in multilevel state', async (done) => {
    app.setHandler({
      State1: {
        State2: {
          END() {
            done();
          },
        },
      },
    });

    const request: JovoRequest = await t.requestBuilder.end();
    request.setState('State1.State2');
    app.handle(ExpressJS.dummyRequest(request));
  });
  /*
  test('test end without end', async (done) => {
    app.setHandler({});

    const request: JovoRequest = await t.requestBuilder.end();
    request.setState('State1.State2');
    app.handle(ExpressJS.dummyRequest(request));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$type.type).toBe(EnumRequestType.END);
      done();
    });
  });

  test('test end (with state) in global ', async (done) => {
    app.setHandler({
      State1: {},
      END() {
        done();
      },
    });

    const request: JovoRequest = await t.requestBuilder.end();
    request.setState('State1');
    app.handle(ExpressJS.dummyRequest(request));
  });
  */
});

export function clearDbFolder() {
  const files = fs.readdirSync(PATH_TO_DB_DIR);

  files.forEach((file) => {
    fs.unlinkSync(path.join(PATH_TO_DB_DIR, file));
  });
}
