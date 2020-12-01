import { App, JovoError } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';

jest.setTimeout(550);
process.env.NODE_ENV = 'UNIT_TEST';

let app: App;

beforeEach(() => {
  app = new App();
  app.use(new Alexa(), new GoogleAssistant());
});

describe('test setPlatformHandler', () => {
  test('setPlatformHandler with valid platform and single handler', () => {
    app.setPlatformHandler('Alexa', {
      LAUNCH() {
        //
      },
      State: {
        Intent() {
          //
        },
      },
    });
    expect(app.config.plugin?.Alexa?.handlers?.LAUNCH).toBeDefined();
    expect(app.config.plugin?.Alexa?.handlers?.State).toBeDefined();
  });
  test('setPlatformHandler with valid platform and multiple handlers', () => {
    app.setPlatformHandler(
      'GoogleAssistant',
      {
        State: {
          Intent() {
            //
          },
        },
      },
      {
        State2: {
          Intent() {
            //
          },
        },
      },
    );
    expect(app.config.plugin?.GoogleAssistant?.handlers?.State).toBeDefined();
    expect(app.config.plugin?.GoogleAssistant?.handlers?.State2).toBeDefined();
  });
  test('setPlatformHandler with invalid platform', () => {
    expect(() => app.setPlatformHandler('undefined', {})).toThrow(JovoError);
  });
});
