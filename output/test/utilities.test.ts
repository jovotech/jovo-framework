import { mergeInstances } from '../src';

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
