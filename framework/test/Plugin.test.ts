import { ExamplePlugin } from './utilities';

describe('constructor', () => {
  test('no config provided: use default config', () => {
    const example = new ExamplePlugin();
    expect(example.config).toEqual(example.getDefaultConfig());
  });

  test('config provided: merge with default config', () => {
    const example = new ExamplePlugin({
      text: 'new value',
    });
    expect(example.config).toEqual({
      text: 'new value',
    });
  });
});
