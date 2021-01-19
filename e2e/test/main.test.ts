import { App } from 'jovo-core';
import { Alexa } from 'jovo-platform-alexa';

const app = new App();

app.use(new Alexa());

app.setHandlers({
  LAUNCH() {
    this.$output = {
      message: 'Hello! What is your name?',
      reprompt: 'Please tell me your name',
    };
  },
});

beforeAll(async () => {
  await app.initialize();
});

test('placeholder', () => {
  expect(true).toBe(true);
});
