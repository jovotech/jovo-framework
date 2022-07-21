import { toSSML, removeSSML, removeSSMLSpeakTags, mergeInstances } from '../src';

describe('toSSML', () => {
  test('plain text', () => {
    expect(toSSML('foo')).toBe('<speak>foo</speak>');
  });

  test('ssml', () => {
    expect(toSSML('<speak>foo</speak>')).toBe('<speak>foo</speak>');
  });
});

describe('removeSSML', () => {
  test('plain text', () => {
    expect(removeSSML('foo')).toBe('foo');
  });

  test('ssml', () => {
    expect(removeSSML('<speak>foo<break time="300ms" /></speak>')).toBe('foo');
  });
});

describe('removeSSMLSpeakTags', () => {
  test('plain text', () => {
    expect(removeSSMLSpeakTags('foo')).toBe('foo');
  });

  test('ssml', () => {
    expect(removeSSMLSpeakTags('<speak>foo<break time="300ms" /></speak>')).toBe(
      'foo<break time="300ms" />',
    );
  });
});

describe('mergeInstances', () => {
  test('test correct merging of two objects', () => {
    const a = {
      a: 'a',
      aObj: {
        a: 'a',
      },
    };

    const b = {
      a: 'b',
      aObj: {
        a: 'b',
      },
    };

    const merged = {
      a: 'b',
      aObj: {
        a: 'b',
      },
    };

    expect(mergeInstances(a, b)).toEqual(merged);
  });

  test('test correct merging of three objects', () => {
    const a = {
      a: 'a',
      aObj: {
        a: 'a',
      },
    };

    const b = {
      a: 'b',
      aObj: {
        a: 'b',
      },
    };

    const c = {
      a: 'c',
      aObj: {
        a: 'c',
      },
    };

    const merged = {
      a: 'c',
      aObj: {
        a: 'c',
      },
    };

    expect(mergeInstances(a, b, c)).toEqual(merged);
  });

  test('test merging of undefined values', () => {
    const a = {
      a: 'a',
      aObj: {
        a: 'a',
      },
    };

    const b = {
      a: undefined,
      aObj: {
        a: undefined,
      },
    };

    const merged = {
      a: undefined,
      aObj: {
        a: undefined,
      },
    };

    expect(mergeInstances(a, b)).toEqual(merged);
  });

  test('test merging of undefined values <>', () => {
    const a = {
      a: 'a',
      aObj: {
        a: 'a',
      },
    };

    const b = {
      a: undefined,
      aObj: {
        a: undefined,
      },
    };

    const merged = {
      a: 'a',
      aObj: {
        a: 'a',
      },
    };

    expect(mergeInstances(b, a)).toEqual(merged);
  });

  test('test merging of nested arrays', () => {
    const a = {
      obj: {
        arr: ['a', 'b'],
      },
    };

    const b = {
      obj: {
        arr: ['c', 'd'],
      },
    };

    const merged = {
      obj: {
        arr: ['a', 'b', 'c', 'd'],
      },
    };

    expect(mergeInstances(b, a)).toEqual(merged);
  });
});
