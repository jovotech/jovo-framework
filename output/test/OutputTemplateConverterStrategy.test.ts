import {
  JovoResponse,
  OutputTemplate,
  OutputTemplateConverterStrategy,
  PlatformOutputTemplate,
} from '../src';

class ExampleResponse extends JovoResponse {}

class ExampleStrategy extends OutputTemplateConverterStrategy<ExampleResponse, any> {
  readonly platformName = 'example' as const;
  readonly responseClass = ExampleResponse;

  fromResponse(response: ExampleResponse[] | ExampleResponse): OutputTemplate | OutputTemplate[] {
    return [];
  }

  toResponse(output: OutputTemplate | OutputTemplate[]): ExampleResponse[] | ExampleResponse {
    return [];
  }
}

declare module '../src' {
  interface OutputTemplatePlatforms {
    example?: PlatformOutputTemplate;
  }
}

const strategy = new ExampleStrategy();

describe('prepareOutput', () => {
  describe('platform-specific output is returned', () => {
    test('object passed', () => {
      const preparedOutput = strategy.prepareOutput({
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
      const preparedOutput = strategy.prepareOutput([
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
      const preparedOutput = strategy.prepareOutput({
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
