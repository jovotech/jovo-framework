import { App, ExpressJS, HandleRequest, JovoRequest, TestSuite } from 'jovo-framework';
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
}
