import { SsmlUtilities } from '../src';

describe('toSSML', () => {
  test('plain text', () => {
    expect(SsmlUtilities.toSSML('foo')).toBe('<speak>foo</speak>');
  });

  test('ssml', () => {
    expect(SsmlUtilities.toSSML('<speak>foo</speak>')).toBe('<speak>foo</speak>');
  });
});

describe('removeSSML', () => {
  test('plain text', () => {
    expect(SsmlUtilities.removeSSML('foo')).toBe('foo');
  });

  test('ssml', () => {
    expect(SsmlUtilities.removeSSML('<speak>foo<break time="300ms" /></speak>')).toBe('foo');
  });
});

describe('removeSSMLSpeakTags', () => {
  test('plain text', () => {
    expect(SsmlUtilities.removeSSMLSpeakTags('foo')).toBe('foo');
  });

  test('ssml', () => {
    expect(SsmlUtilities.removeSSMLSpeakTags('<speak>foo<break time="300ms" /></speak>')).toBe(
      'foo<break time="300ms" />',
    );
  });
});
