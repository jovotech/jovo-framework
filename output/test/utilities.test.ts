import { toSSML, removeSSML, removeSSMLSpeakTags } from '../src';

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
