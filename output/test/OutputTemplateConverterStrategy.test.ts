import {
  JovoResponse,
  OutputTemplate,
  OutputTemplateConverterStrategy,
  PlatformOutputTemplate,
} from '../src';

class ExampleResponse extends JovoResponse {}

class ExampleStrategy extends OutputTemplateConverterStrategy<ExampleResponse, any> {
  readonly platformName = 'Example';
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
    Example?: PlatformOutputTemplate;
  }
}

const strategy = new ExampleStrategy();

describe('prepareOutput', () => {
  describe('platform-specific output is returned', () => {
    test('object passed', () => {
      const preparedOutput = strategy.prepareOutput({
        message: 'foo',
        platforms: {
          Example: {
            message: 'bar',
          },
        },
      });
      expect(preparedOutput).toEqual({
        message: 'bar',
        platforms: {
          Example: {
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
            Example: {
              message: 'bar',
            },
          },
        },
        {
          message: 'Hello',
          platforms: {
            Example: {
              message: 'World',
            },
          },
        },
      ]);
      expect(preparedOutput).toEqual([
        {
          message: 'bar',
          platforms: {
            Example: {
              message: 'bar',
            },
          },
        },
        {
          message: 'World',
          platforms: {
            Example: {
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
          Example: {
            message: 'bar',
          },
          Alexa: {
            message: 'more',
          },
        },
      });
      expect(preparedOutput).toEqual({
        message: 'bar',
        platforms: {
          Example: {
            message: 'bar',
          },
        },
      });
    });
  });
});
