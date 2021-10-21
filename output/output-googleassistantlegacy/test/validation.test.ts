import { NormalizedOutputTemplate, plainToClass, validate, ValidationOptions } from '@jovotech/output';
import { SimpleResponse } from '../src';

function transformAndValidate<T extends Record<string, any> = Record<string, any>>(
  objClass: new () => T,
  obj: T,
  options?: ValidationOptions,
) {
  return validate(plainToClass(objClass, obj), options);
}

async function validateAndExpectLength<T>(
  objClass: new () => T,
  obj: T,
  expectedLength: number,
  options?: ValidationOptions,
) {
  const errors = await transformAndValidate(objClass, obj, options);
  expect(errors).toHaveLength(expectedLength);
}

describe('validation - OutputTemplate', () => {
  test('GoogleAssistant - optional', () => {
    return validateAndExpectLength(NormalizedOutputTemplate, {}, 0);
  });

  test('GoogleAssistant - invalid: wrong type', () => {
    return validateAndExpectLength(
      NormalizedOutputTemplate,
      {
        platforms: { googleAssistant: 2 },
      } as any,
      1,
    );
  });

  test('GoogleAssistant - invalid: wrong nested value', () => {
    return validateAndExpectLength(
      NormalizedOutputTemplate,
      {
        platforms: {
          googleAssistant: {
            quickReplies: 2 as any,
          },
        },
      },
      1,
    );
  });

  test('GoogleAssistant - valid', () => {
    return validateAndExpectLength(
      NormalizedOutputTemplate,
      {
        platforms: {
          googleAssistant: {
            message: 'foo',
            quickReplies: [],
          },
        },
      },
      0,
    );
  });
});

describe('validation - SimpleResponse', () => {
  test('empty - invalid: either ssml or textToSpeech should be set', () => {
    return validateAndExpectLength(SimpleResponse, {}, 2);
  });

  test('ssml - invalid: empty', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        ssml: '',
      },
      1,
    );
  });
  test('ssml - invalid: wrong type', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        ssml: 2 as any,
      },
      1,
    );
  });
  test('ssml - valid: string', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        ssml: 'foo',
      },
      0,
    );
  });

  test('textToSpeech - invalid: empty', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        textToSpeech: '',
      },
      1,
    );
  });
  test('textToSpeech - invalid: wrong type', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        textToSpeech: 2 as any,
      },
      1,
    );
  });
  test('textToSpeech - valid: string', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        textToSpeech: 'foo',
      },
      0,
    );
  });

  test('displayText - invalid: empty', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        ssml: 'foo',
        displayText: '',
      },
      1,
    );
  });
  test('displayText - invalid: wrong type', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        ssml: 'foo',
        displayText: 2 as any,
      },
      1,
    );
  });
  test('displayText - valid: string', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        ssml: 'foo',
        displayText: 'bar',
      },
      0,
    );
  });

  test('ssml and textToSpeech set - invalid: either can only be set', () => {
    return validateAndExpectLength(
      SimpleResponse,
      {
        ssml: '',
        textToSpeech: '',
      },
      2,
    );
  });
});
