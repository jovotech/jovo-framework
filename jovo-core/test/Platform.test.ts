import { DEFAULT_PLATFORM_MIDDLEWARES } from '../src';
import { EmptyPlatform, ExamplePlatform } from './utilities';

describe('constructor', () => {
  test('no config provided: use default config', () => {
    const platform = new ExamplePlatform();
    expect(platform.config).toEqual(platform.getDefaultConfig());
  });

  test('config provided: merge with default config', () => {
    const platform = new ExamplePlatform({
      text: 'new value',
    });
    expect(platform.config).toEqual({
      text: 'new value',
    });
  });
});

describe('middlewareCollection', () => {
  test('no middlewareCollection was specified: default set used', () => {
    const platform = new ExamplePlatform();
    expect(Object.keys(platform.middlewareCollection.middlewares)).toEqual(
      DEFAULT_PLATFORM_MIDDLEWARES,
    );
  });

  test('middlewareCollection was specified: default overwritten', () => {
    const platform = new EmptyPlatform();
    expect(Object.keys(platform.middlewareCollection.middlewares)).toHaveLength(0);
  });
});
