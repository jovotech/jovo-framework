import { BASE_PLATFORM_MIDDLEWARES } from '../src';
import { EmptyPlatform, ExamplePlatform } from './utilities';

describe('middlewareCollection', () => {
  test('no middlewareCollection was specified: default set used', () => {
    const platform = new ExamplePlatform();
    expect(Object.keys(platform.middlewareCollection.middlewares)).toEqual(
      BASE_PLATFORM_MIDDLEWARES,
    );
  });

  test('middlewareCollection was specified: default overwritten', () => {
    const platform = new EmptyPlatform();
    expect(Object.keys(platform.middlewareCollection.middlewares)).toHaveLength(0);
  });
});
