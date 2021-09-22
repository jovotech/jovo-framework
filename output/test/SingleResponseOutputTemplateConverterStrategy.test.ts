import {
  JovoResponse,
  OutputTemplate,
  SingleResponseOutputTemplateConverterStrategy,
} from '../src';

class ExampleResponse extends JovoResponse {}

class ExampleStrategy extends SingleResponseOutputTemplateConverterStrategy<ExampleResponse, any> {
  readonly platformName = 'example' as const;
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
    describe('messages are concatenated', () => {
      test('string + string passed', () => {
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
      test('string + object passed', () => {
        const preparedOutput = strategy.prepareOutput([
          {
            message: 'Hello',
            reprompt: 'Hello',
          },
          {
            message: { speech: 'World!', text: 'World!' },
            reprompt: { speech: 'World!' },
          },
        ]);
        expect(preparedOutput).toEqual({
          message: {
            speech: 'Hello World!',
            text: 'Hello World!',
          },
          reprompt: {
            speech: 'Hello World!',
            text: 'Hello',
          },
        });
      });
      test('object + object passed', () => {
        const preparedOutput = strategy.prepareOutput([
          {
            message: { speech: 'Hello', text: 'Hello' },
            reprompt: { speech: 'Hello' },
          },
          {
            message: { speech: 'World!' },
            reprompt: { speech: 'World!' },
          },
        ]);
        expect(preparedOutput).toEqual({
          message: { speech: 'Hello World!', text: 'Hello' },
          reprompt: { speech: 'Hello World!' },
        });
      });

      test('multiple speak tags result in a single speak tag', () => {
        const preparedOutput = strategy.prepareOutput([
          {
            message: '<speak>Hello</speak>',
          },
          {
            message: '<speak>World!</speak>',
          },
        ]);
        expect(preparedOutput).toEqual({
          message: '<speak>Hello World!</speak>',
        });
      });
      test('SSML removed for text', () => {
        const preparedOutput = strategy.prepareOutput([
          {
            message: '<speak>Hello</speak>',
          },
          {
            message: { speech: 'World!', text: 'World!' },
          },
        ]);
        expect(preparedOutput).toEqual({
          message: {
            speech: '<speak>Hello World!</speak>',
            text: 'Hello World!',
          },
        });
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
            example: {
              nativeResponse: {
                foo: 'bar',
              },
            },
          },
        },
        {
          platforms: {
            example: {
              nativeResponse: {
                bar: 'foo',
              },
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        platforms: {
          example: {
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
            example: {
              message: 'Hello',
            },
          },
        },
        {
          platforms: {
            example: {
              message: 'World!',
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        message: 'Hello World!',
        platforms: {
          example: {
            message: 'Hello World!',
          },
        },
      });
    });

    test('platform quick-replies are concatenated', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          platforms: {
            example: {
              quickReplies: ['foo'],
            },
          },
        },
        {
          platforms: {
            example: {
              quickReplies: ['bar'],
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual({
        quickReplies: ['foo', 'bar'],
        platforms: {
          example: {
            quickReplies: ['foo', 'bar'],
          },
        },
      });
    });

    test('platform card is replaced', () => {
      const preparedOutput = strategy.prepareOutput([
        {
          platforms: {
            example: {
              card: {
                title: 'foo',
              },
            },
          },
        },
        {
          platforms: {
            example: {
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
          example: {
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
            example: {
              carousel: {
                title: 'foo',
                items: [],
              },
            },
          },
        },
        {
          platforms: {
            example: {
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
          example: {
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
