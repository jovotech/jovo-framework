import {
  Card,
  OutputTemplate,
  OutputTemplateConverter,
  OutputValidationError,
  toSSML,
} from '@jovotech/output';
import {
  GoogleAssistantOutputTemplateConverterStrategy,
  GoogleAssistantResponse,
  RichResponse,
  SimpleResponse,
  SystemIntent,
} from '../src';

const outputConverter = new OutputTemplateConverter(
  new GoogleAssistantOutputTemplateConverterStrategy(),
);

async function convertToResponseAndExpectToEqual(
  output: OutputTemplate,
  expectedResponse: GoogleAssistantResponse,
) {
  expect(await outputConverter.toResponse(output)).toEqual(expectedResponse);
}

async function convertToOutputAndExpectToEqual(
  response: GoogleAssistantResponse,
  expectedOutput: OutputTemplate,
) {
  expect(await outputConverter.fromResponse(response)).toEqual(expectedOutput);
}

describe('toResponse', () => {
  describe('output.message', () => {
    test('output.message is string', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
        },
        {
          richResponse: {
            items: [
              {
                simpleResponse: {
                  ssml: toSSML('foo'),
                },
              },
            ],
          },
        },
      );
    });
    test('output.message is Message', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: {
            text: 'foo',
            displayText: 'bar',
          },
        },
        {
          richResponse: {
            items: [
              {
                simpleResponse: {
                  ssml: toSSML('foo'),
                  displayText: 'bar',
                },
              },
            ],
          },
        },
      );
    });
    test('output.platforms.GoogleAssistant.message overwrites output.message', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          platforms: {
            GoogleAssistant: {
              message: 'bar',
            },
          },
        },
        {
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('bar') } }],
          },
        },
      );
    });
  });

  describe('output.reprompt', () => {
    test('output.reprompt is set but not output.message', () => {
      return expect(
        outputConverter.toResponse({
          reprompt: 'foo',
        }),
      ).rejects.toThrowError(OutputValidationError);
    });
    test('output.reprompt is string', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          reprompt: 'bar',
        },
        {
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
          noInputPrompts: [{ ssml: toSSML('bar') }],
        },
      );
    });
    test('output.reprompt is Message', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          reprompt: {
            text: 'bar',
            displayText: 'test',
          },
        },
        {
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
          noInputPrompts: [{ ssml: toSSML('bar'), displayText: 'test' }],
        },
      );
    });
    test('output.platforms.GoogleAssistant.reprompt overwrites output.reprompt', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          reprompt: 'bar',
          platforms: {
            GoogleAssistant: {
              reprompt: 'foo',
            },
          },
        },
        {
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
          noInputPrompts: [{ ssml: toSSML('foo') }],
        },
      );
    });
  });

  describe('output.listen', () => {
    test('output.listen is set but not output.message', () => {
      return expect(
        outputConverter.toResponse({
          listen: true,
        }),
      ).rejects.toThrowError(OutputValidationError);
    });
    test('output.listen is false', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          listen: false,
        },
        {
          expectUserResponse: false,
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });
    test('output.listen is true', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          listen: true,
        },
        {
          expectUserResponse: true,
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });
    test('output.platforms.GoogleAssistant.listen overwrites output.listen', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          listen: true,
          platforms: {
            GoogleAssistant: {
              listen: false,
            },
          },
        },
        {
          expectUserResponse: false,
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });
  });

  describe('output.quickReplies', () => {
    test('output.quickReplies is set but not output.message', () => {
      return expect(
        outputConverter.toResponse({
          quickReplies: [],
        }),
      ).rejects.toThrowError(OutputValidationError);
    });
    test('output.quickReplies is set but has more than 8 items', () => {
      return expect(
        outputConverter.toResponse({
          message: 'foo',
          quickReplies: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
        }),
      ).rejects.toThrowError(OutputValidationError);
    });
    test('output.quickReplies is array of string and QuickReply', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          quickReplies: ['hello', { text: 'world' }],
        },
        {
          richResponse: {
            suggestions: [{ title: 'hello' }, { title: 'world' }],
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });
    test('output.platforms.GoogleAssistant.quickReplies overwrites output.quickReplies', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          quickReplies: ['hello'],
          platforms: {
            GoogleAssistant: {
              quickReplies: ['world'],
            },
          },
        },
        {
          richResponse: {
            suggestions: [{ title: 'world' }],
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });
  });

  describe('output.card', () => {
    test('output.card is set but not output.message', () => {
      return expect(
        outputConverter.toResponse({
          card: {
            title: 'foo',
            content: 'bar',
          },
        }),
      ).rejects.toThrowError(OutputValidationError);
    });
    test('output.card is set without image and content', () => {
      return expect(
        outputConverter.toResponse({
          message: 'foo',
          card: {
            title: 'foo',
          },
        }),
      ).rejects.toThrowError(OutputValidationError);
    });
    test('output.card is set with content', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          card: {
            title: 'foo',
            content: 'bar',
          },
        },
        {
          richResponse: {
            items: [
              { simpleResponse: { ssml: toSSML('foo') } },
              { basicCard: { title: 'foo', formattedText: 'bar' } },
            ],
          },
        },
      );
    });
    test('output.card is set with image', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          card: {
            title: 'foo',
            imageUrl: 'https://via.placeholder.com/150',
          },
        },
        {
          richResponse: {
            items: [
              { simpleResponse: { ssml: toSSML('foo') } },
              {
                basicCard: {
                  title: 'foo',
                  image: { url: 'https://via.placeholder.com/150', accessibilityText: 'foo' },
                },
              },
            ],
          },
        },
      );
    });
    test('output.card is set with image and content', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          card: {
            title: 'foo',
            content: 'bar',
            imageUrl: 'https://via.placeholder.com/150',
          },
        },
        {
          richResponse: {
            items: [
              { simpleResponse: { ssml: toSSML('foo') } },
              {
                basicCard: {
                  title: 'foo',
                  formattedText: 'bar',
                  image: { url: 'https://via.placeholder.com/150', accessibilityText: 'foo' },
                },
              },
            ],
          },
        },
      );
    });
    test('output.platforms.GoogleAssistant.card overwrites output.card', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          card: {
            title: 'foo',
            content: 'bar',
          },
          platforms: {
            GoogleAssistant: {
              card: {
                title: 'overwritten',
                content: 'overwritten',
              },
            },
          },
        },
        {
          richResponse: {
            items: [
              { simpleResponse: { ssml: toSSML('foo') } },
              {
                basicCard: {
                  title: 'overwritten',
                  formattedText: 'overwritten',
                },
              },
            ],
          },
        },
      );
    });
  });

  describe('output.carousel', () => {
    test('output.carousel is set but not output.message', () => {
      return expect(
        outputConverter.toResponse({
          carousel: {
            items: [
              {
                title: 'foo',
                content: 'bar',
              },
              {
                title: 'bar',
                content: 'foo',
              },
            ],
          },
        }),
      ).rejects.toThrowError(OutputValidationError);
    });

    test('output.carousel is set and has fewer than 2 items - failure', () => {
      return expect(
        outputConverter.toResponse({
          message: 'foo',
          carousel: {
            items: [{ title: 'foo', content: 'bar' }],
          },
        }),
      ).rejects.toThrowError(OutputValidationError);
    });

    test('output.carousel is set and has 2 or more items', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          carousel: {
            items: [
              { title: 'foo', subtitle: 'bar', key: 'test' },
              { title: 'bar', subtitle: 'foo' },
            ],
          },
        },
        {
          systemIntent: {
            intent: 'actions.intent.OPTION',
            data: {
              '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
              'carouselSelect': {
                items: [
                  {
                    optionInfo: {
                      key: 'test',
                      synonyms: [],
                    },
                    title: 'foo',
                    description: 'bar',
                  },
                  {
                    optionInfo: {
                      key: 'bar',
                      synonyms: [],
                    },
                    title: 'bar',
                    description: 'foo',
                  },
                ],
              },
            },
          },
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });

    test('output.carousel is set and has more than 10 items - failure', () => {
      return expect(
        outputConverter.toResponse({
          message: 'foo',
          carousel: {
            items: ([] as Card[]).fill({ title: 'foo', content: 'bar' }, 0, 10),
          },
        }),
      ).rejects.toThrowError(OutputValidationError);
    });

    test('output.platforms.GoogleAssistant.carousel overwrites output.carousel', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          carousel: {
            items: [
              { title: 'foo', subtitle: 'bar', key: 'test' },
              { title: 'bar', subtitle: 'foo' },
            ],
          },
          platforms: {
            GoogleAssistant: {
              carousel: {
                items: [
                  { title: 'bar', subtitle: 'foo' },
                  { title: 'foo', subtitle: 'bar', key: 'test' },
                ],
              },
            },
          },
        },
        {
          systemIntent: {
            intent: 'actions.intent.OPTION',
            data: {
              '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
              'carouselSelect': {
                items: [
                  {
                    optionInfo: {
                      key: 'bar',
                      synonyms: [],
                    },
                    title: 'bar',
                    description: 'foo',
                  },
                  {
                    optionInfo: {
                      key: 'test',
                      synonyms: [],
                    },
                    title: 'foo',
                    description: 'bar',
                  },
                ],
              },
            },
          },
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });
  });

  describe('platform-specific properties', () => {
    test('output.platforms.GoogleAssistant.nativeResponse.expectUserResponse overwrites output.listen and output.GoogleAssistant.listen', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          listen: false,
          platforms: {
            GoogleAssistant: {
              listen: false,
              nativeResponse: {
                expectUserResponse: true,
              },
            },
          },
        },
        {
          expectUserResponse: true,
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });

    test('output.platforms.GoogleAssistant.nativeResponse.systemIntent overwrites output.carousel and output.GoogleAssistant.carousel', () => {
      const systemIntent: SystemIntent = {
        intent: 'actions.intent.OPTION',
        data: {
          '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
          'carouselSelect': {
            items: [
              {
                optionInfo: {
                  key: 'one',
                  synonyms: [],
                },
                title: 'one',
                description: 'one',
              },
              {
                optionInfo: {
                  key: 'two',
                  synonyms: [],
                },
                title: 'two',
                description: 'two',
              },
            ],
          },
        },
      };
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          carousel: {
            items: [
              { title: 'foo', subtitle: 'bar', key: 'test' },
              { title: 'bar', subtitle: 'foo' },
            ],
          },
          platforms: {
            GoogleAssistant: {
              carousel: {
                items: [
                  { title: 'bar', subtitle: 'foo' },
                  { title: 'foo', subtitle: 'bar', key: 'test' },
                ],
              },
              nativeResponse: {
                systemIntent,
              },
            },
          },
        },
        {
          systemIntent,
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });

    test('output.platforms.GoogleAssistant.nativeResponse.noInputPrompts overwrites output.reprompt and output.GoogleAssistant.reprompt', () => {
      const noInputPrompts: SimpleResponse[] = [{ ssml: toSSML('test') }];
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          reprompt: 'foo',
          platforms: {
            GoogleAssistant: {
              reprompt: 'bar',
              nativeResponse: {
                noInputPrompts,
              },
            },
          },
        },
        {
          noInputPrompts,
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo') } }],
          },
        },
      );
    });

    test('output.platforms.GoogleAssistant.nativeResponse.richResponse overwrites richResponse', () => {
      const richResponse: RichResponse = {
        items: [{ simpleResponse: { ssml: toSSML('test') } }],
      };
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          card: {
            title: 'test',
            content: 'more',
          },
          platforms: {
            GoogleAssistant: {
              nativeResponse: {
                richResponse,
              },
            },
          },
        },
        {
          richResponse: {
            ...richResponse,
            items: [
              ...richResponse.items,
              {
                basicCard: {
                  formattedText: 'more',
                  title: 'test',
                },
              },
            ],
          },
        },
      );
    });
  });
});

describe('fromResponse', () => {
  test('response.expectUserResponse', () => {
    return convertToOutputAndExpectToEqual(
      {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                ssml: toSSML('foo'),
              },
            },
          ],
        },
      },
      {
        message: 'foo',
        listen: true,
      },
    );
  });

  test('response.systemIntent', () => {
    return convertToOutputAndExpectToEqual(
      {
        systemIntent: {
          intent: 'actions.intent.OPTION',
          data: {
            '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
            'carouselSelect': {
              items: [
                { optionInfo: { key: 'one', synonyms: [] }, title: 'one' },
                { optionInfo: { key: 'two', synonyms: [] }, title: 'two' },
              ],
            },
          },
        },
        richResponse: {
          items: [
            {
              simpleResponse: {
                ssml: toSSML('foo'),
              },
            },
          ],
        },
      },
      {
        message: 'foo',
        carousel: {
          items: [
            { key: 'one', title: 'one' },
            { key: 'two', title: 'two' },
          ],
        },
      },
    );
  });

  test('response.noInputPrompts', () => {
    return convertToOutputAndExpectToEqual(
      {
        noInputPrompts: [{ ssml: toSSML('foo') }],
        richResponse: {
          items: [
            {
              simpleResponse: {
                ssml: toSSML('foo'),
              },
            },
          ],
        },
      },
      {
        message: 'foo',
        reprompt: 'foo',
      },
    );
  });

  test('response.richResponse', () => {
    return convertToOutputAndExpectToEqual(
      {
        richResponse: {
          suggestions: [{ title: 'one' }, { title: 'two' }],
          items: [
            {
              simpleResponse: {
                ssml: toSSML('foo'),
              },
            },
          ],
        },
      },
      {
        message: 'foo',
        quickReplies: ['one', 'two'],
      },
    );
  });
});
