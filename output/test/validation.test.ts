import { plainToClass } from 'class-transformer';
import {
  Card,
  Carousel,
  Message,
  OutputTemplate,
  QuickReply,
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

describe('validation - QuickReply', () => {
  testStringProperty(QuickReply, 'text');
  testOptionalStringProperty(QuickReply, 'value', {
    text: 'foo',
  });
});

describe('validation - Message', () => {
  testStringProperty(Message, 'speech');
  testOptionalStringProperty(Message, 'text', {
    speech: 'foo',
  });
});

describe('validation - Card', () => {
  testStringProperty(Card, 'title');
  testOptionalStringProperty(Card, 'key', {
    title: 'foo',
  });
  testOptionalStringProperty(Card, 'subtitle', {
    title: 'foo',
  });

  test('imageUrl - optional', async () => {
    await validateAndExpectLength(
      Card,
      {
        title: 'foo',
      },
      0,
    );
  });
  test('imageUrl - invalid: empty', async () => {
    await validateAndExpectLength(
      Card,
      {
        title: 'foo',
        imageUrl: '',
      },
      1,
    );
  });
  test('imageUrl - invalid: wrong type', async () => {
    await validateAndExpectLength(
      Card,
      {
        title: 'foo',
        imageUrl: 2 as any,
      },
      1,
    );
  });
  test('imageUrl - invalid: no url', async () => {
    await validateAndExpectLength(
      Card,
      {
        title: 'foo',
        imageUrl: 'foo',
      },
      1,
    );
  });
  test('imageUrl - valid: url', async () => {
    await validateAndExpectLength(
      Card,
      {
        title: 'foo',
        imageUrl: 'https://placeholder.com',
      },
      0,
    );
  });
});

describe('validation - Carousel', () => {
  test('items - invalid: wrong type', async () => {
    await validateAndExpectLength(
      Carousel,
      {
        items: {} as any,
      },
      1,
    );
  });
  test('items - invalid: fewer than 2 elements', async () => {
    await validateAndExpectLength(
      Carousel,
      {
        items: [{ title: 'foo' }],
      },
      1,
    );
  });
  test('items - invalid: element not a card', async () => {
    await validateAndExpectLength(
      Carousel,
      {
        items: [2] as any,
      },
      1,
    );
  });
  test('items - invalid: invalid element', async () => {
    await validateAndExpectLength(
      Carousel,
      {
        items: [{ title: 2 as any }],
      },
      1,
    );
  });
  test('items - valid', async () => {
    await validateAndExpectLength(
      Carousel,
      {
        items: [{ title: 'foo' }, { title: 'bar' }],
      },
      0,
    );
  });

  testOptionalStringProperty(Carousel, 'title', {
    items: [{ title: 'foo' }, { title: 'bar' }],
  });
});

describe('validation - OutputTemplate', () => {
  test(`message - optional`, async () => {
    await validateAndExpectLength(OutputTemplate, { message: undefined }, 0);
  });

  test(`message - valid: empty`, async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        message: '',
      },
      0,
    );
  });
  test(`message - invalid: wrong type`, async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        message: 2 as any,
      },
      1,
    );
  });
  test(`message - valid: string`, async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        message: 'foo',
      },
      0,
    );
  });

  test('message - invalid: invalid object', async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        message: {} as any,
      },
      1,
    );
  });
  test('message - valid: object', async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        message: {
          speech: 'foo',
        },
      },
      0,
    );
  });

  testOptionalStringProperty(OutputTemplate, 'reprompt');
  test('reprompt - invalid: invalid object', async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        reprompt: {
          speech: '',
        },
      },
      1,
    );
  });
  test('reprompt - valid: object', async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        reprompt: {
          speech: 'foo',
        },
      },
      0,
    );
  });

  test('listen - optional', async () => {
    await validateAndExpectLength(OutputTemplate, {}, 0);
  });
  test('listen - invalid: wrong type', async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        listen: 3 as any,
      },
      1,
    );
  });
  test('listen - valid: boolean', async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        listen: true,
      },
      0,
    );
  });

  test('quickReplies - optional', async () => {
    await validateAndExpectLength(OutputTemplate, {}, 0);
  });
  test('quickReplies - invalid: wrong type', async () => {
    await validateAndExpectLength(OutputTemplate, { quickReplies: {} as any }, 1);
  });
  test('quickReplies - invalid: invalid element', async () => {
    await validateAndExpectLength(OutputTemplate, { quickReplies: [2] as any }, 1);
  });
  test('quickReplies - valid', async () => {
    await validateAndExpectLength(OutputTemplate, { quickReplies: ['foo', { text: 'bar' }] }, 0);
  });

  test('cards - optional', async () => {
    await validateAndExpectLength(OutputTemplate, {}, 0);
  });
  test('cards - invalid: wrong type', async () => {
    await validateAndExpectLength(OutputTemplate, { card: 2 as any }, 1);
  });
  test('cards - invalid: invalid object', async () => {
    await validateAndExpectLength(OutputTemplate, { card: {} as any }, 1);
  });
  test('cards - valid', async () => {
    await validateAndExpectLength(OutputTemplate, { card: { title: 'foo' } }, 0);
  });

  test('collection - optional', async () => {
    await validateAndExpectLength(OutputTemplate, {}, 0);
  });
  test('collection - invalid: wrong type', async () => {
    await validateAndExpectLength(OutputTemplate, { carousel: 'foo' as any }, 1);
  });
  test('collection - invalid: invalid object', async () => {
    await validateAndExpectLength(OutputTemplate, { carousel: { items: {} as any } }, 1);
  });
  test('collection - valid', async () => {
    await validateAndExpectLength(
      OutputTemplate,
      {
        carousel: {
          items: [{ title: 'foo' }, { title: 'bar' }],
        },
      },
      0,
    );
  });
});
