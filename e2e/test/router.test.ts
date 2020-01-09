import {
  App,
  EnumRequestType,
  ExpressJS,
  HandleRequest,
  Jovo,
  JovoRequest,
  LogLevel,
  TestSuite,
} from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';

jest.setTimeout(550);
process.env.NODE_ENV = 'UNIT_TEST';

let app: App;
let t: TestSuite;

for (const p of [new Alexa(), new GoogleAssistant()]) {
  beforeEach(() => {
    app = new App();
    app.use(p);
    t = p.makeTestSuite();
  });

  describe('test request types', () => {
    test('test launch', async (done) => {
      app.setHandler({
        LAUNCH() {
          return;
        },
      });

      const launchRequest: JovoRequest = await t.requestBuilder.launch();
      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$type.type).toBe(EnumRequestType.LAUNCH);
        done();
      });
    });

    test('test intent', async (done) => {
      app.setHandler({
        HelloWorldIntent() {
          return;
        },
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
          return;
        },
      });

      const request: JovoRequest = await t.requestBuilder.end();
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$type.type).toBe(EnumRequestType.END);
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
  });

  describe('test toIntent', () => {
    test('no return', async (done) => {
      app.setHandler({
        LAUNCH() {
          this.toIntent('HelloWorldIntent');
        },
        HelloWorldIntent() {
          this.tell('to intent');
        },
      });

      const launchRequest: JovoRequest = await t.requestBuilder.launch();
      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('to intent')).toBe(true);
        done();
      });
    });
    test('with return', async (done) => {
      app.setHandler({
        LAUNCH() {
          return this.toIntent('HelloWorldIntent');
        },
        HelloWorldIntent() {
          this.tell('to intent');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('to intent')).toBe(true);
        done();
      });
    });

    test('with async method in called method', async (done) => {
      app.setHandler({
        LAUNCH() {
          return this.toIntent('HelloWorldIntent');
        },
        async HelloWorldIntent() {
          await delay(150);
          this.tell('to intent after delay');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('to intent after delay')).toBe(true);
        done();
      });
    });

    test('test within the same state', async (done) => {
      app.setHandler({
        State1: {
          IntentA() {
            return this.toIntent('IntentB');
          },
          IntentB() {
            this.tell('Hello IntentB');
          },
        },
      });
      const intentRequest: JovoRequest = await t.requestBuilder.intent('IntentA');

      app.handle(ExpressJS.dummyRequest(intentRequest.setState('State1')));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('Hello IntentB')).toBe(true);
        done();
      });
    });

    test('test in global handler', async (done) => {
      app.setHandler({
        State1: {
          IntentA() {
            return this.toIntent('IntentB');
          },
        },
        IntentB() {
          this.tell('Hello IntentB');
        },
      });
      const intentRequest: JovoRequest = await t.requestBuilder.intent('IntentA');

      app.handle(ExpressJS.dummyRequest(intentRequest.setState('State1')));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('Hello IntentB')).toBe(true);
        done();
      });
    });

    test('test multiple toIntents', async (done) => {
      app.setHandler({
        LAUNCH() {
          return this.toIntent('IntentA');
        },
        IntentA() {
          return this.toIntent('IntentB');
        },
        IntentB() {
          this.tell('Hello IntentB');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('Hello IntentB')).toBe(true);
        done();
      });
    });

    test('test from ON_REQUEST with skipping LAUNCH', async (done) => {
      app.setHandler({
        ON_REQUEST() {
          return this.toIntent('IntentA');
        },
        LAUNCH() {
          this.tell('LAUNCH');
        },
        IntentA() {
          this.tell('Hello toIntent');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('Hello toIntent')).toBe(true);
        done();
      });
    });
  });
  describe('test toStateIntent', () => {
    test('no return', async (done) => {
      app.setHandler({
        LAUNCH() {
          this.toStateIntent('State', 'HelloWorldIntent');
        },
        State: {
          HelloWorldIntent() {
            this.tell('to intent');
          },
        }, // tslint:disable-line
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('to intent')).toBe(true);
        done();
      });
    });
    test('with return', async (done) => {
      app.setHandler({
        LAUNCH() {
          return this.toStateIntent('State', 'HelloWorldIntent');
        },
        State: {
          HelloWorldIntent() {
            this.tell('to intent');
          },
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('to intent')).toBe(true);
        done();
      });
    });
  });
  describe('test handleOnRequest', () => {
    test('no ON_REQUEST', async (done) => {
      app.setHandler({
        LAUNCH() {
          expect(this.$data.foo).toBe(undefined);
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        done();
      });
    });

    test('ON_REQUEST synchronous', async (done) => {
      app.setHandler({
        ON_REQUEST() {
          this.$data.foo = 'bar';
        },
        LAUNCH() {
          expect(this.$data.foo).toBe('bar');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        done();
      });
    });

    test('ON_REQUEST asynchronous with promise', async (done) => {
      app.setHandler({
        ON_REQUEST() {
          return new Promise((resolve) => {
            this.$data.foo = 'bar2';
            resolve();
          });
        },
        LAUNCH() {
          expect(this.$data.foo).toBe('bar2');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        done();
      });
    });

    test('ON_REQUEST asynchronous with callback parameter', async (done) => {
      app.setHandler({
        ON_REQUEST(jovo: Jovo, d: Function) {
          setTimeout(() => {
            this.$data.foo = 'bar3';
            d();
          }, 10);
        },
        LAUNCH() {
          expect(this.$data.foo).toBe('bar3');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        done();
      });
    });

    test('ON_REQUEST return and skip intent handling', async (done) => {
      app.setHandler({
        ON_REQUEST() {
          return this.tell('ON_REQUEST');
        },
        LAUNCH() {
          // skip this
          this.tell('LAUNCH');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));
      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('ON_REQUEST')).toBeTruthy();
        done();
      });
    });

    test('ON_REQUEST skip intent handling inside of a callback', async (done) => {
      app.setHandler({
        NEW_SESSION(jovo, callback) {
          setTimeout(() => {
            this.tell('ON_REQUEST').skipIntentHandling();
            callback!();
          }, 5);
        },
        LAUNCH() {
          // skip this
          this.tell('LAUNCH');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));
      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('ON_REQUEST')).toBeTruthy();
        done();
      });
    });
  });
  describe('test handleOnNewSession', () => {
    test('no NEW_SESSION', async (done) => {
      app.setHandler({
        LAUNCH() {
          expect(this.$data.foo).toBe(undefined);
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        done();
      });
    });

    test('NEW_SESSION but request with old session', async (done) => {
      app.setHandler({
        NEW_SESSION() {
          // shouldn't be reached
          this.$data.foo = 'bar';
        },
        IntentA() {
          expect(this.$data.foo).toBe(undefined);
        },
      });
      const intentRequest: JovoRequest = await t.requestBuilder.intent('IntentA');

      app.handle(ExpressJS.dummyRequest(intentRequest.setNewSession(false)));

      app.on('response', (handleRequest: HandleRequest) => {
        done();
      });
    });

    test('NEW_SESSION synchronous', async (done) => {
      app.setHandler({
        NEW_SESSION() {
          this.$data.foo = 'bar';
        },
        LAUNCH() {
          expect(this.$data.foo).toBe('bar');
          done();
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();
      app.handle(ExpressJS.dummyRequest(launchRequest));
    });

    test('NEW_SESSION asynchronous with promise', async (done) => {
      app.setHandler({
        NEW_SESSION() {
          return new Promise((resolve) => {
            this.$data.foo = 'bar2';
            resolve();
          });
        },
        LAUNCH() {
          expect(this.$data.foo).toBe('bar2');
          done();
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));
    });

    test('NEW_SESSION asynchronous with callback parameter', async (done) => {
      app.setHandler({
        NEW_SESSION(jovo: Jovo, d: Function) {
          setTimeout(() => {
            this.$data.foo = 'bar3';
            d();
          }, 10);
        },
        LAUNCH() {
          expect(this.$data.foo).toBe('bar3');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        done();
      });
    });

    test('NEW_SESSION toIntent', async (done) => {
      app.setHandler({
        NEW_SESSION() {
          this.$data.foo = 'bar';
          return this.toIntent('NewUserIntent');
        },
        LAUNCH() {
          // skip this
        },
        NewUserIntent() {
          expect(this.$data.foo).toBe('bar');
          done();
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));
    });

    test('NEW_SESSION return and skip intent handling', async (done) => {
      app.setHandler({
        NEW_SESSION() {
          return this.tell('NEW_SESSION');
        },
        LAUNCH() {
          // skip this
          this.tell('LAUNCH');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));
      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('NEW_SESSION')).toBeTruthy();
        done();
      });
    });

    test('NEW_SESSION skip intent handling inside of a callback', async (done) => {
      app.setHandler({
        NEW_SESSION(jovo, callback) {
          setTimeout(() => {
            this.tell('NEW_SESSION').skipIntentHandling();
            callback!();
          }, 5);
        },
        LAUNCH() {
          // skip this
          this.tell('LAUNCH');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));
      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('NEW_SESSION')).toBeTruthy();
        done();
      });
    });
  });

  describe('test handleOnNewUser', () => {
    test('no NEW_USER', async (done) => {
      app.setHandler({
        LAUNCH() {
          expect(this.$data.foo).toBe(undefined);
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));

      app.on('response', (handleRequest: HandleRequest) => {
        done();
      });
    });

    test('NEW_USER synchronous', async (done) => {
      app.setHandler({
        NEW_USER() {
          this.$data.foo = 'bar';
        },
        LAUNCH() {
          expect(this.$data.foo).toBe('bar');
          done();
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
    });

    test('NEW_USER asynchronous with promise', async (done) => {
      app.setHandler({
        NEW_USER() {
          return new Promise((resolve) => {
            this.$data.foo = 'bar2';
            resolve();
          });
        },
        LAUNCH() {
          expect(this.$data.foo).toBe('bar2');
          done();
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
    });

    test('NEW_USER asynchronous with callback parameter', async (done) => {
      app.setHandler({
        NEW_USER(jovo: Jovo, d: Function) {
          setTimeout(() => {
            this.$data.foo = 'bar3';
            d();
          }, 10);
        },
        LAUNCH() {
          expect(this.$data.foo).toBe('bar3');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));

      app.on('response', (handleRequest: HandleRequest) => {
        done();
      });
    });

    test('NEW_USER toIntent', async (done) => {
      app.setHandler({
        NEW_USER() {
          this.$data.foo = 'bar';
          return this.toIntent('NewUserIntent');
        },
        LAUNCH() {
          // skip this
        },
        NewUserIntent() {
          expect(this.$data.foo).toBe('bar');
          done();
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
    });

    test('NEW_USER return and skip intent handling', async (done) => {
      app.setHandler({
        NEW_USER() {
          return this.tell('NEW_USER');
        },
        LAUNCH() {
          // skip this
          this.tell('LAUNCH');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('NEW_USER')).toBeTruthy();
        done();
      });
    });

    test('NEW_USER skip intent handling inside of a callback', async (done) => {
      app.setHandler({
        NEW_USER(jovo, callback) {
          setTimeout(() => {
            this.tell('NEW_USER').skipIntentHandling();
            callback!();
          }, 5);
        },
        LAUNCH() {
          // skip this
          this.tell('LAUNCH');
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.isTell('NEW_USER')).toBeTruthy();
        done();
      });
    });
  });
  describe('test NEW_USER + NEW_SESSION + ON_REQUEST', () => {
    test('correct order', async (done) => {
      app.setHandler({
        NEW_USER() {
          this.$data.foo = ['NEW_USER'];
        },
        NEW_SESSION() {
          this.$data.foo.push('NEW_SESSION');
        },
        ON_REQUEST() {
          this.$data.foo.push('ON_REQUEST');
        },
        LAUNCH() {
          this.$data.foo.push('LAUNCH');
          return this.toIntent('IntentAfterToIntent');
        },
        IntentAfterToIntent() {
          expect(this.$data.foo[0]).toBe('NEW_USER');
          expect(this.$data.foo[1]).toBe('NEW_SESSION');
          expect(this.$data.foo[2]).toBe('ON_REQUEST');
          expect(this.$data.foo[3]).toBe('LAUNCH');

          done();
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest.setUserId(randomUserId())));
    });
  });

  describe('test removeState', () => {
    test('test add followUpstate to session attributes', async (done) => {
      app.setHandler({
        State1: {
          IntentA() {
            expect(this.getState()).toBe('State1');
            this.removeState();
            expect(this.getState()).toBe(undefined);
            done();
          },
        },
      });
      const intentRequest: JovoRequest = await t.requestBuilder.intent('IntentA');

      app.handle(ExpressJS.dummyRequest(intentRequest.setState('State1')));
    });
  });

  describe('test followUpState', () => {
    test('test add followUpstate to session attributes', async (done) => {
      app.setHandler({
        LAUNCH() {
          this.followUpState('State1').ask('Hello World', 'foo');
        },
        State1: {
          IntentA() {
            return;
          },
        },
      });
      const launchRequest: JovoRequest = await t.requestBuilder.launch();

      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$response!.hasState('State1')).toBe(true);
        expect(handleRequest.jovo!.$response!.isAsk('Hello World')).toBe(true);
        done();
      });
    });
  });

  describe('test app listener', () => {
    test('test onRequest', async (done) => {
      app.setHandler({
        LAUNCH() {
          return;
        },
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

  test('test intentMap', async (done) => {
    app.setHandler({
      HelloIntent() {
        this.tell('Hello!');
      },
    });
    app.config.plugin!.Router!.intentMap = {
      HelloWorldIntent: 'HelloIntent',
    };
    const request: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent');
    app.handle(ExpressJS.dummyRequest(request));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isTell('Hello!')).toBeTruthy();
      done();
    });
  });

  test('test intentMap with predefined handler path', async (done) => {
    app.setHandler({
      END() {
        this.tell('Hello!');
      },
    });
    app.config.plugin!.Router!.intentMap = {
      StopIntent: 'END',
    };
    const request: JovoRequest = await t.requestBuilder.intent('StopIntent');
    app.handle(ExpressJS.dummyRequest(request));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.isTell('Hello!')).toBeTruthy();
      done();
    });
  });

  test('test getIntentName and getMappedIntentName', async (done) => {
    app.setHandler({
      HelloIntent() {
        expect(this.getIntentName()).toEqual('HelloWorldIntent');
        expect(this.getMappedIntentName()).toEqual('HelloIntent');
        done();
      },
    });
    app.config.plugin!.Router!.intentMap = {
      HelloWorldIntent: 'HelloIntent',
    };
    const request: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent');
    app.handle(ExpressJS.dummyRequest(request));
  });

  test('test getRoute', async (done) => {
    app.setHandler({
      LAUNCH() {
        const route = this.getRoute();
        expect(route.type).toEqual('LAUNCH');
        expect(route.intent).toBeUndefined();
        done();
      },
    });
    const request: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(request));
  });
  test('test getRoute with toIntent', async (done) => {
    app.setHandler({
      LAUNCH() {
        return this.toIntent('HelloIntent');
      },
      HelloIntent() {
        const route = this.getRoute();

        expect(route.from).toEqual('LAUNCH');
        expect(route.type).toEqual('INTENT');
        expect(route.intent).toEqual('HelloIntent');

        done();
      },
    });
    const request: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(request));
  });

  test('test getRoute with multiple toIntent', async (done) => {
    app.setHandler({
      LAUNCH() {
        return this.toIntent('HelloIntent');
      },
      HelloIntent() {
        return this.toIntent('HelloWorldIntent');
      },
      HelloWorldIntent() {
        const route = this.getRoute();

        expect(route.from).toEqual('LAUNCH/HelloIntent');
        expect(route.type).toEqual('INTENT');
        expect(route.intent).toEqual('HelloWorldIntent');

        done();
      },
    });
    const request: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(request));
  });
}

const delay = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

const randomUserId = () => {
  return (
    'user-' +
    Math.random()
      .toString(36)
      .substring(5) +
    '-' +
    Math.random()
      .toString(36)
      .substring(2)
  );
};
