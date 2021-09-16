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
  SUGGESTIONS_MAX_SIZE,
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
                  displayText: 'foo',
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
            speech: 'foo',
            text: 'bar',
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
    test('output.platforms.googleAssistant.message overwrites output.message', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          platforms: {
            googleAssistant: {
              message: 'bar',
            },
          },
        },
        {
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('bar'), displayText: 'bar' } }],
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
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          },
          noInputPrompts: [{ ssml: toSSML('bar'), displayText: 'bar' }],
        },
      );
    });
    test('output.reprompt is Message', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          reprompt: {
            speech: 'bar',
            text: 'test',
          },
        },
        {
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          },
          noInputPrompts: [{ ssml: toSSML('bar'), displayText: 'test' }],
        },
      );
    });
    test('output.platforms.googleAssistant.reprompt overwrites output.reprompt', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          reprompt: 'bar',
          platforms: {
            googleAssistant: {
              reprompt: 'foo',
            },
          },
        },
        {
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          },
          noInputPrompts: [{ ssml: toSSML('foo'), displayText: 'foo' }],
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
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
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
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          },
        },
      );
    });
    test('output.platforms.googleAssistant.listen overwrites output.listen', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          listen: true,
          platforms: {
            googleAssistant: {
              listen: false,
            },
          },
        },
        {
          expectUserResponse: false,
          richResponse: {
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
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
    test('output.quickReplies is set but has more than 8 items', async () => {
      const quickReplies = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
      return expect(
        await outputConverter.toResponse({
          message: 'foo',
          quickReplies,
        }),
      ).toEqual({
        richResponse: {
          items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          suggestions: quickReplies.slice(0, SUGGESTIONS_MAX_SIZE).map((title) => ({ title })),
        },
      });
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
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          },
        },
      );
    });
    test('output.platforms.googleAssistant.quickReplies overwrites output.quickReplies', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          quickReplies: ['hello'],
          platforms: {
            googleAssistant: {
              quickReplies: ['world'],
            },
          },
        },
        {
          richResponse: {
            suggestions: [{ title: 'world' }],
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
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
              { simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } },
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
              { simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } },
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
              { simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } },
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
    test('output.platforms.googleAssistant.card overwrites output.card', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          card: {
            title: 'foo',
            content: 'bar',
          },
          platforms: {
            googleAssistant: {
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
              { simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } },
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
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
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

    test('output.platforms.googleAssistant.carousel overwrites output.carousel', () => {
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
            googleAssistant: {
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
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          },
        },
      );
    });
  });

  describe('platform-specific properties', () => {
    test('output.platforms.googleAssistant.nativeResponse.expectUserResponse overwrites output.listen and output.googleAssistant.listen', () => {
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          listen: false,
          platforms: {
            googleAssistant: {
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
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          },
        },
      );
    });

    test('output.platforms.googleAssistant.nativeResponse.systemIntent overwrites output.carousel and output.googleAssistant.carousel', () => {
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
            googleAssistant: {
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
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          },
        },
      );
    });

    test('output.platforms.googleAssistant.nativeResponse.noInputPrompts overwrites output.reprompt and output.googleAssistant.reprompt', () => {
      const noInputPrompts: SimpleResponse[] = [{ ssml: toSSML('test') }];
      return convertToResponseAndExpectToEqual(
        {
          message: 'foo',
          reprompt: 'foo',
          platforms: {
            googleAssistant: {
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
            items: [{ simpleResponse: { ssml: toSSML('foo'), displayText: 'foo' } }],
          },
        },
      );
    });

    test('output.platforms.googleAssistant.nativeResponse.richResponse overwrites richResponse', () => {
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
            googleAssistant: {
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
        message: toSSML('foo'),
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
        message: toSSML('foo'),
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
        message: toSSML('foo'),
        reprompt: toSSML('foo'),
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
        message: toSSML('foo'),
        quickReplies: ['one', 'two'],
      },
    );
  });
});
