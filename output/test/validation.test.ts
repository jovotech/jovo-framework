import { plainToClass } from 'class-transformer';
import {
  GenericCard,
  GenericCarousel,
  GenericMessage,
  GenericOutput,
  GenericQuickReply,
  validate,
  ValidationOptions,
} from '../src';

function transformAndValidate<T extends Record<string, any> = Record<string, any>>(
  objClass: new () => T,
  obj: T,
  options?: ValidationOptions,
) {
  return validate(plainToClass(objClass, obj), options);
}

function testStringProperty<T extends Record<string, any> = Record<string, any>>(
  objClass: new () => T,
  propertyKey: keyof T,
  additionalData: Partial<T> = {},
) {
  test(`${propertyKey} - invalid: empty`, async () => {
    await validateAndExpectLength(
      objClass,
      {
        ...additionalData,
        [propertyKey]: '',
      } as T,
      1,
    );
  });
  test(`${propertyKey} - invalid: wrong type`, async () => {
    await validateAndExpectLength(
      objClass,
      {
        ...additionalData,
        [propertyKey]: 2,
      } as T,
      1,
    );
  });
  test(`${propertyKey} - valid: string`, async () => {
    await validateAndExpectLength(
      objClass,
      {
        ...additionalData,
        [propertyKey]: 'foo',
      } as T,
      0,
    );
  });
}

function testOptionalStringProperty<T extends Record<string, any> = Record<string, any>>(
  objClass: new () => T,
  propertyKey: keyof T,
  additionalData: Partial<T> = {},
) {
  test(`${propertyKey} - optional`, async () => {
    await validateAndExpectLength(
      objClass,
      {
        ...additionalData,
        [propertyKey]: undefined,
      } as T,
      0,
    );
  });
  testStringProperty(objClass, propertyKey, additionalData);
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

describe('validation - GenericQuickReply', () => {
  testStringProperty(GenericQuickReply, 'text');
  testOptionalStringProperty(GenericQuickReply, 'value', {
    text: 'foo',
  });
});

describe('validation - GenericMessage', () => {
  testStringProperty(GenericMessage, 'text');
  testOptionalStringProperty(GenericMessage, 'displayText', {
    text: 'foo',
  });

  test('quickReplies - optional', async () => {
    await validateAndExpectLength(GenericMessage, { text: 'foo' }, 0);
  });
  test('quickReplies - invalid: wrong type', async () => {
    await validateAndExpectLength(GenericMessage, { text: 'foo', quickReplies: {} as any }, 1);
  });
  test('quickReplies - invalid: invalid element', async () => {
    await validateAndExpectLength(GenericMessage, { text: 'foo', quickReplies: [2] as any }, 1);
  });
  test('quickReplies - valid', async () => {
    await validateAndExpectLength(
      GenericMessage,
      { text: 'foo', quickReplies: ['foo', { text: 'bar' }] },
      0,
    );
  });
});

describe('validation - GenericCard', () => {
  testStringProperty(GenericCard, 'title');
  testOptionalStringProperty(GenericCard, 'key', {
    title: 'foo',
  });
  testOptionalStringProperty(GenericCard, 'subtitle', {
    title: 'foo',
  });

  test('imageUrl - optional', async () => {
    await validateAndExpectLength(
      GenericCard,
      {
        title: 'foo',
      },
      0,
    );
  });
  test('imageUrl - invalid: empty', async () => {
    await validateAndExpectLength(
      GenericCard,
      {
        title: 'foo',
        imageUrl: '',
      },
      1,
    );
  });
  test('imageUrl - invalid: wrong type', async () => {
    await validateAndExpectLength(
      GenericCard,
      {
        title: 'foo',
        imageUrl: 2 as any,
      },
      1,
    );
  });
  test('imageUrl - invalid: no url', async () => {
    await validateAndExpectLength(
      GenericCard,
      {
        title: 'foo',
        imageUrl: 'foo',
      },
      1,
    );
  });
  test('imageUrl - valid: url', async () => {
    await validateAndExpectLength(
      GenericCard,
      {
        title: 'foo',
        imageUrl: 'https://placeholder.com',
      },
      0,
    );
  });
});

describe('validation - GenericCarousel', () => {
  test('items - invalid: wrong type', async () => {
    await validateAndExpectLength(
      GenericCarousel,
      {
        items: {} as any,
      },
      1,
    );
  });
  test('items - invalid: fewer than 2 elements', async () => {
    await validateAndExpectLength(
      GenericCarousel,
      {
        items: [{ title: 'foo' }],
      },
      1,
    );
  });
  test('items - invalid: element not a card', async () => {
    await validateAndExpectLength(
      GenericCarousel,
      {
        items: [2] as any,
      },
      1,
    );
  });
  test('items - invalid: invalid element', async () => {
    await validateAndExpectLength(
      GenericCarousel,
      {
        items: [{ title: 2 as any }],
      },
      1,
    );
  });
  test('items - valid', async () => {
    await validateAndExpectLength(
      GenericCarousel,
      {
        items: [{ title: 'foo' }, { title: 'bar' }],
      },
      0,
    );
  });

  testOptionalStringProperty(GenericCarousel, 'title', {
    items: [{ title: 'foo' }, { title: 'bar' }],
  });
});

describe('validation - GenericOutput', () => {
  testOptionalStringProperty(GenericOutput, 'message');
  test('message - invalid: invalid object', async () => {
    await validateAndExpectLength(
      GenericOutput,
      {
        message: {} as any,
      },
      1,
    );
  });
  test('message - valid: object', async () => {
    await validateAndExpectLength(
      GenericOutput,
      {
        message: {
          text: 'foo',
        },
      },
      0,
    );
  });

  testOptionalStringProperty(GenericOutput, 'reprompt');
  test('reprompt - invalid: invalid object', async () => {
    await validateAndExpectLength(
      GenericOutput,
      {
        reprompt: {
          text: '',
        },
      },
      1,
    );
  });
  test('reprompt - valid: object', async () => {
    await validateAndExpectLength(
      GenericOutput,
      {
        reprompt: {
          text: 'foo',
        },
      },
      0,
    );
  });

  test('listen - optional', async () => {
    await validateAndExpectLength(GenericOutput, {}, 0);
  });
  test('listen - invalid: wrong type', async () => {
    await validateAndExpectLength(
      GenericOutput,
      {
        listen: 3 as any,
      },
      1,
    );
  });
  test('listen - valid: boolean', async () => {
    await validateAndExpectLength(
      GenericOutput,
      {
        listen: true,
      },
      0,
    );
  });

  test('quickReplies - optional', async () => {
    await validateAndExpectLength(GenericOutput, {}, 0);
  });
  test('quickReplies - invalid: wrong type', async () => {
    await validateAndExpectLength(GenericOutput, { quickReplies: {} as any }, 1);
  });
  test('quickReplies - invalid: invalid element', async () => {
    await validateAndExpectLength(GenericOutput, { quickReplies: [2] as any }, 1);
  });
  test('quickReplies - valid', async () => {
    await validateAndExpectLength(GenericOutput, { quickReplies: ['foo', { text: 'bar' }] }, 0);
  });

  test('cards - optional', async () => {
    await validateAndExpectLength(GenericOutput, {}, 0);
  });
  test('cards - invalid: wrong type', async () => {
    await validateAndExpectLength(GenericOutput, { card: 2 as any }, 1);
  });
  test('cards - invalid: invalid object', async () => {
    await validateAndExpectLength(GenericOutput, { card: {} as any }, 1);
  });
  test('cards - valid', async () => {
    await validateAndExpectLength(GenericOutput, { card: { title: 'foo' } }, 0);
  });

  test('collection - optional', async () => {
    await validateAndExpectLength(GenericOutput, {}, 0);
  });
  test('collection - invalid: wrong type', async () => {
    await validateAndExpectLength(GenericOutput, { carousel: 'foo' as any }, 1);
  });
  test('collection - invalid: invalid object', async () => {
    await validateAndExpectLength(GenericOutput, { carousel: { items: {} as any } }, 1);
  });
  test('collection - valid', async () => {
    await validateAndExpectLength(
      GenericOutput,
      {
        carousel: {
          items: [{ title: 'foo' }, { title: 'bar' }],
        },
      },
      0,
    );
  });
});
