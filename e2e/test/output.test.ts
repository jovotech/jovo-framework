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
        expect(handleRequest.jovo!.$response!.isTell('Hello <break time="100ms"/>')).toBe(true);
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
        expect(
          handleRequest.jovo!.$response!.isAsk(
            'Hello <break time="100ms"/>',
            'Reprompt <break time="100ms"/>',
          ),
        ).toBe(true);
        done();
      });
    });
  });
}
