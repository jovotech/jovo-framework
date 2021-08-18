import {
  JovoResponse,
  OutputTemplate,
  SingleResponseOutputTemplateConverterStrategy,
} from '../src';

class ExampleResponse extends JovoResponse {}

class ExampleStrategy extends SingleResponseOutputTemplateConverterStrategy<ExampleResponse, any> {
  readonly platformName = 'Example';
  readonly responseClass: { new (): ExampleResponse };

  toResponse(output: OutputTemplate): ExampleResponse {
    return output;
  }

  fromResponse(response: ExampleResponse): OutputTemplate {
    return {};
  }

  protected sanitizeOutput(output: OutputTemplate): OutputTemplate {
    return output;
  }
}

const strategy = new ExampleStrategy();

describe('prepareOutput', () => {
  describe('OutputTemplate-array is merged into single object', () => {
    test('messages are concatenated', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          message: 'Hello',
          reprompt: 'Hello',
        },
        {
          message: 'World!',
          reprompt: 'World!',
        },
      ]);
      expect(preparedOutput).toEqual({
        message: 'Hello World!',
        reprompt: 'Hello World!',
      });
    });

    test('quick-replies are concatenated', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          quickReplies: ['foo'],
        },
        {
          quickReplies: ['bar'],
        },
      ]);
      expect(preparedOutput).toEqual({
        quickReplies: ['foo', 'bar'],
      });
    });

    test('card is replaced', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          card: {
            title: 'foo',
          },
        },
        {
          card: {
            title: 'bar',
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        card: {
          title: 'bar',
        },
      });
    });

    test('carousel is replaced', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          carousel: {
            title: 'foo',
            items: [],
          },
        },
        {
          carousel: {
            title: 'bar',
            items: [],
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        carousel: {
          title: 'bar',
          items: [],
        },
      });
    });

    test('nativeResponse is merged', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          platforms: {
            Example: {
              nativeResponse: {
                foo: 'bar',
              },
            },
          },
        },
        {
          platforms: {
            Example: {
              nativeResponse: {
                bar: 'foo',
              },
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        platforms: {
          Example: {
            nativeResponse: {
              foo: 'bar',
              bar: 'foo',
            },
          },
        },
      });
    });

    test('platform message is truncated', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          platforms: {
            Example: {
              message: 'Hello',
            },
          },
        },
        {
          platforms: {
            Example: {
              message: 'World!',
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        message: 'Hello World!',
        platforms: {
          Example: {
            message: 'Hello World!',
          },
        },
      });
    });

    test('platform quick-replies are concatenated', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          platforms: {
            Example: {
              quickReplies: ['foo'],
            },
          },
        },
        {
          platforms: {
            Example: {
              quickReplies: ['bar'],
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        quickReplies: ['foo', 'bar'],
        platforms: {
          Example: {
            quickReplies: ['foo', 'bar'],
          },
        },
      });
    });

    test('platform card is replaced', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          platforms: {
            Example: {
              card: {
                title: 'foo',
              },
            },
          },
        },
        {
          platforms: {
            Example: {
              card: {
                title: 'bar',
              },
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        card: {
          title: 'bar',
        },
        platforms: {
          Example: {
            card: {
              title: 'bar',
            },
          },
        },
      });
    });

    test('platform carousel is replaced', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          platforms: {
            Example: {
              carousel: {
                title: 'foo',
                items: [],
              },
            },
          },
        },
        {
          platforms: {
            Example: {
              carousel: {
                title: 'bar',
                items: [],
              },
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        carousel: {
          title: 'bar',
          items: [],
        },
        platforms: {
          Example: {
            carousel: {
              title: 'bar',
              items: [],
            },
          },
        },
      });
    });
  });
});
