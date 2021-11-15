import {
  JovoResponse,
  NormalizedOutputTemplate,
  OutputTemplateConverterStrategyConfig,
  SingleResponseOutputTemplateConverterStrategy,
} from '../src';

class ExampleResponse extends JovoResponse {
  hasSessionEnded(): boolean {
    return false;
  }
}

class ExampleStrategy extends SingleResponseOutputTemplateConverterStrategy<
  ExampleResponse,
  OutputTemplateConverterStrategyConfig
> {
  readonly platformName = 'example' as const;
  readonly responseClass!: { new (): ExampleResponse };

  toResponse(output: NormalizedOutputTemplate): ExampleResponse {
    return output as ExampleResponse;
  }

  fromResponse(): NormalizedOutputTemplate {
    return {};
  }

  protected sanitizeOutput(output: NormalizedOutputTemplate): NormalizedOutputTemplate {
    return output;
  }
}

const strategy = new ExampleStrategy();

describe('prepareOutput', () => {
  describe('NormalizedOutputTemplate-array is merged into single object', () => {
    describe('messages are concatenated', () => {
      test('string + string passed', () => {
        const preparedOutput = strategy.normalizeOutput([
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
        const preparedOutput = strategy.normalizeOutput([
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
        const preparedOutput = strategy.normalizeOutput([
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
        const preparedOutput = strategy.normalizeOutput([
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
        const preparedOutput = strategy.normalizeOutput([
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

    describe('listen is merged', () => {
      test('true + false = false', () => {
        const preparedOutput = strategy.normalizeOutput([
          {
            listen: true,
          },
          {
            listen: false,
          },
        ]);
        expect(preparedOutput).toEqual({
          listen: false,
        });
      });

      test('false + true = true', () => {
        const preparedOutput = strategy.normalizeOutput([
          {
            listen: false,
          },
          {
            listen: true,
          },
        ]);
        expect(preparedOutput).toEqual({
          listen: true,
        });
      });

      test('object + false = false', () => {
        const preparedOutput = strategy.normalizeOutput([
          {
            listen: { entities: {} },
          },
          {
            listen: false,
          },
        ]);
        expect(preparedOutput).toEqual({
          listen: false,
        });
      });

      test('false + object = object', () => {
        const preparedOutput = strategy.normalizeOutput([
          {
            listen: false,
          },
          {
            listen: { entities: {} },
          },
        ]);
        expect(preparedOutput).toEqual({
          listen: { entities: {} },
        });
      });

      test('true + object = object', () => {
        const preparedOutput = strategy.normalizeOutput([
          {
            listen: true,
          },
          {
            listen: { entities: {} },
          },
        ]);
        expect(preparedOutput).toEqual({
          listen: {
            entities: {},
          },
        });
      });

      test('special case - object + true = object', () => {
        const preparedOutput = strategy.normalizeOutput([
          {
            listen: { entities: {} },
          },
          {
            listen: true,
          },
        ]);
        expect(preparedOutput).toEqual({
          listen: {
            entities: {},
          },
        });
      });
    });

    test('quick-replies are concatenated', () => {
      const preparedOutput = strategy.normalizeOutput([
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
      const preparedOutput = strategy.normalizeOutput([
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
      const preparedOutput = strategy.normalizeOutput([
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
      const preparedOutput = strategy.normalizeOutput([
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
      const preparedOutput = strategy.normalizeOutput([
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
      const preparedOutput = strategy.normalizeOutput([
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
      const preparedOutput = strategy.normalizeOutput([
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
      const preparedOutput = strategy.normalizeOutput([
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
