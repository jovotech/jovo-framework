import {
  JovoResponse,
  NormalizedOutputTemplate,
  OutputTemplateConverterStrategy,
  NormalizedPlatformOutputTemplate,
  OutputTemplateConverterStrategyConfig,
} from '../src';

class ExampleResponse extends JovoResponse {
  hasSessionEnded(): boolean {
    return false;
  }
}

class ExampleStrategy extends OutputTemplateConverterStrategy<
  ExampleResponse,
  OutputTemplateConverterStrategyConfig
> {
  readonly platformName = 'example' as const;
  readonly responseClass = ExampleResponse;

  fromResponse(): NormalizedOutputTemplate | NormalizedOutputTemplate[] {
    return [];
  }

  toResponse(): ExampleResponse[] | ExampleResponse {
    return [];
  }
}

declare module '../src' {
  interface NormalizedOutputTemplatePlatforms {
    example?: NormalizedPlatformOutputTemplate;
  }
}

const strategy = new ExampleStrategy();

describe('prepareOutput', () => {
  describe('platform-specific output is returned', () => {
    test('object passed', () => {
      const preparedOutput = strategy.normalizeOutput({
        message: 'foo',
        platforms: {
          example: {
            message: 'bar',
          },
        },
      });
      expect(preparedOutput).toEqual({
        message: 'bar',
        platforms: {
          example: {
            message: 'bar',
          },
        },
      });
    });

    test('array passed', () => {
      const preparedOutput = strategy.normalizeOutput([
        {
          message: 'foo',
          platforms: {
            example: {
              message: 'bar',
            },
          },
        },
        {
          message: 'Hello',
          platforms: {
            example: {
              message: 'World',
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual([
        {
          message: 'bar',
          platforms: {
            example: {
              message: 'bar',
            },
          },
        },
        {
          message: 'World',
          platforms: {
            example: {
              message: 'World',
            },
          },
        },
      ]);
    });

    test('other platform-specific output-templates are removed', () => {
      const preparedOutput = strategy.normalizeOutput({
        message: 'foo',
        platforms: {
          example: {
            message: 'bar',
          },
          alexa: {
            message: 'more',
          },
        },
      });
      expect(preparedOutput).toEqual({
        message: 'bar',
        platforms: {
          example: {
            message: 'bar',
          },
        },
      });
    });
  });
});
