import {
  EnumRequestType,
  HandleRequest,
  Jovo,
  JovoRequest,
  LogLevel,
  SessionConstants,
  TestSuite,
} from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework'; // tslint:disable-line
import { CorePlatform } from '../src';
import { RequestSLU } from './helper/RequestSLU';

// tslint:disable-next-line
console.log = () => {};

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);
const delay = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

beforeEach(() => {
  app = new App();
  const corePlatform = new CorePlatform();
  corePlatform.use(new RequestSLU());
  app.use(corePlatform);
  t = corePlatform.makeTestSuite();
});

describe('test request types', () => {
  test('test launch', async (done) => {
    app.setHandler({
      // tslint:disable-next-line
      LAUNCH() {},
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
      // tslint:disable-next-line
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
      // tslint:disable-next-line
      END() {},
    });

    const request: JovoRequest = await t.requestBuilder.end();
    app.handle(ExpressJS.dummyRequest(request));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$type.type).toBe(EnumRequestType.END);
      done();
    });
  });
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
      // expect(handleRequest.jovo!.$response!.isTell('Hello <break time="100ms"/>')).toBe(true);
      expect(handleRequest.jovo!.$response!.isTell('Hello ')).toBe(true);
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
      expect(handleRequest.jovo!.$response!.isAsk('Hello World!', 'Reprompt!')).toBe(true);
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
      // expect(handleRequest.jovo!.$response!.isAsk('Hello <break time="100ms"/>', 'Reprompt <break time="100ms"/>')).toBe(true);
      expect(handleRequest.jovo!.$response!.isAsk('Hello ', 'Reprompt ')).toBe(true);
      done();
    });
  });
});

describe('test $inputs', () => {
  test('test getInput, $inputs', async (done) => {
    app.setHandler({
      HelloWorldIntent() {
        expect(this.getInput('name')!.value).toBe('Joe');
        expect(this.$inputs!.name.value).toBe('Joe');
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent', {
      name: 'Joe',
    });
    app.handle(ExpressJS.dummyRequest(intentRequest));
  });

  test('test mapInputs', async (done) => {
    app.setConfig({
      inputMap: {
        'given-name': 'name',
      },
    });
    app.setHandler({
      HelloWorldIntent() {
        expect(this.getInput('name')!.value).toBe('Joe');
        expect(this.$inputs!.name.value).toBe('Joe');
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent', {
      'given-name': 'Joe',
    });
    app.handle(ExpressJS.dummyRequest(intentRequest));
  }, 100);
});

describe('test intentMap', () => {
  test('test inputMap', async (done) => {
    app.setConfig({
      intentMap: {
        HelloWorldIntent: 'MappedHelloWorldIntent',
      },
    });
    app.setHandler({
      MappedHelloWorldIntent() {
        expect(true).toBe(true);
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('HelloWorldIntent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));
  }, 100);

  test('test inputMap with predefined handler path', async (done) => {
    app.setConfig({
      intentMap: {
        'Stop.Intent': 'END',
      },
    });
    app.setHandler({
      END() {
        expect(true).toBe(true);
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('Stop.Intent', {});
    app.handle(ExpressJS.dummyRequest(intentRequest));
  }, 100);
});

describe('test $data', () => {
  test('test different scopes', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$app.$data.appData = 'appData';
        this.$data.thisData = 'thisData';
        this.$session!.$data.sessionData = 'sessionData';
        this.toIntent('HelloWorldIntent');
      },
      HelloWorldIntent() {
        this.ask('foo', 'bar');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$app.$data.appData).toBe('appData');
      expect(handleRequest.jovo!.$data.thisData).toBe('thisData');
      expect(handleRequest.jovo!.$response!.hasSessionAttribute('sessionData', 'sessionData')).toBe(
        true,
      );
      done();
    });
  });
});

describe('test state', () => {
  test('test getState', async (done) => {
    app.setHandler({
      TestState: {
        SessionIntent() {
          expect(this.getState()).toBe('TestState');
          done();
        },
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('SessionIntent', {});
    intentRequest.setSessionAttributes({
      [SessionConstants.STATE]: 'TestState',
    });
    app.handle(ExpressJS.dummyRequest(intentRequest));
  });

  test('test keep state', async (done) => {
    app.setHandler({
      TestState: {
        SessionIntent() {
          this.ask('Hello', 'World');
        },
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('SessionIntent', {});
    intentRequest.setSessionAttributes({
      [SessionConstants.STATE]: 'TestState',
    });
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(
        handleRequest.jovo!.$response!.hasSessionAttribute(SessionConstants.STATE, 'TestState'),
      ).toBe(true);
      done();
    });
  });

  test('test removeState', async (done) => {
    app.setHandler({
      TestState: {
        SessionIntent() {
          this.removeState();
          this.ask('Hello', 'World');
        },
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('SessionIntent', {});
    intentRequest.setSessionAttributes({
      [SessionConstants.STATE]: 'TestState',
    });
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.hasSessionAttribute(SessionConstants.STATE)).toBe(
        false,
      );
      done();
    });
  });

  test('test setState', async (done) => {
    app.setHandler({
      TestState: {
        SessionIntent() {
          this.setState('AnotherTestState');
          this.ask('Hello', 'World');
        },
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('SessionIntent', {});
    intentRequest.setSessionAttributes({
      [SessionConstants.STATE]: 'TestState',
    });
    app.handle(ExpressJS.dummyRequest(intentRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(
        handleRequest.jovo!.$response!.hasSessionAttribute(
          SessionConstants.STATE,
          'AnotherTestState',
        ),
      ).toBe(true);
      done();
    });
  });
});

describe('test session attributes', () => {
  test('test get session', async (done) => {
    app.setHandler({
      SessionIntent() {
        expect(this.getSessionAttribute('sessionName1')).toBe('sessionValue1');
        expect(this.$session!.$data.sessionName2).toBe('sessionValue2');

        this.ask('Foo', 'Bar');
        done();
      },
    });

    const intentRequest: JovoRequest = await t.requestBuilder.intent('SessionIntent', {});
    intentRequest.setSessionAttributes({
      sessionName1: 'sessionValue1',
      sessionName2: 'sessionValue2',
    });
    app.handle(ExpressJS.dummyRequest(intentRequest));
  });

  test('test set session', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.setSessionAttribute('sessionName1', 'sessionValue1');
        this.addSessionAttribute('sessionName2', 'sessionValue2');
        this.$session!.$data.sessionName3 = 'sessionValue3';
        this.ask('Foo', 'Bar');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(
        handleRequest.jovo!.$response!.hasSessionAttribute('sessionName1', 'sessionValue1'),
      ).toBe(true);
      expect(
        handleRequest.jovo!.$response!.hasSessionAttribute('sessionName2', 'sessionValue2'),
      ).toBe(true);
      expect(
        handleRequest.jovo!.$response!.hasSessionAttribute('sessionName3', 'sessionValue3'),
      ).toBe(true);

      done();
    });
  });

  test('test setSessionAttributes', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.setSessionAttributes({
          sessionName1: 'sessionValue1',
          sessionName2: 'sessionValue2',
          sessionName3: 'sessionValue3',
        });
        this.ask('Foo', 'Bar');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(
        handleRequest.jovo!.$response!.hasSessionAttribute('sessionName1', 'sessionValue1'),
      ).toBe(true);
      expect(
        handleRequest.jovo!.$response!.hasSessionAttribute('sessionName2', 'sessionValue2'),
      ).toBe(true);
      expect(
        handleRequest.jovo!.$response!.hasSessionAttribute('sessionName3', 'sessionValue3'),
      ).toBe(true);
      done();
    });
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
describe('test followUpState', () => {
  test('test add followUpstate to session attributes', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.followUpState('State1').ask('Hello World', 'foo');
      },
      State1: {
        // tslint:disable-next-line
        IntentA() {},
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
      ON_REQUEST(jovo, callback) {
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

describe('test app listener', () => {
  test('test onRequest', async (done) => {
    app.setHandler({
      // tslint:disable-next-line
      LAUNCH() {},
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

describe('test app config', () => {
  test('test keepSessionDataOnSessionEnded (default = false) ', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$session.$data.foo = 'bar';
        this.tell('Hello World!');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.hasSessionAttribute('foo')).toBe(false);
      done();
    });
  });
  test('test keepSessionDataOnSessionEnded (true) ', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$session.$data.foo = 'bar';
        this.tell('Hello World!');
      },
    });
    // @ts-ignore
    app.config.keepSessionDataOnSessionEnded = true;

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$response!.hasSessionAttribute('foo')).toBe(true);
      done();
    });
  });
});

describe('test routing', () => {
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
});
