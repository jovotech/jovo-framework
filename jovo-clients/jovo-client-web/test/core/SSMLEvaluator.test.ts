import { SSMLEvaluator } from '../../src';

describe('test SSMLEvaluator', () => {
  const examplePlainText = 'Hello World';
  const exampleAudioSSML = '<audio src="source"></audio>';
  const exampleBreakSSML = '<break time="300ms"/>';
  const exampleSSML = `<speak>${examplePlainText}${exampleBreakSSML}${exampleAudioSSML}</speak>`;
  const exampleSSMLTagless = examplePlainText + exampleBreakSSML + exampleAudioSSML;

  test('test toSSML - plain text', () => {
    expect(SSMLEvaluator.toSSML('test')).toBe('<speak>test</speak>');
  });

  test('test toSSML - SSML', () => {
    expect(SSMLEvaluator.toSSML('<speak>test</speak>')).toBe('<speak>test</speak>');
  });

  test('test removeSSML omit all tags', () => {
    expect(SSMLEvaluator.removeSSML(exampleSSML)).toBe(examplePlainText);
  });

  test('test removeSSML keep break tag', () => {
    expect(SSMLEvaluator.removeSSML('<speak>test<break time="3s"/></speak>', ['break'])).toBe(
      'test<break time="3s"/>',
    );
  });

  test('test removeSpeakTags', () => {
    expect(SSMLEvaluator.removeSpeakTags(exampleSSML)).toBe(exampleSSMLTagless);
  });

  test('test getSSMLParts', () => {
    expect(SSMLEvaluator.getSSMLParts('<speak>test<break time="3s"/></speak>')).toStrictEqual([
      'test',
      '<break time="3s"/>',
    ]);
  });

  test('test getBreakTime ms', () => {
    expect(SSMLEvaluator.getBreakTime(exampleBreakSSML)).toBe(300);
  });

  test('test getBreakTime s', () => {
    expect(SSMLEvaluator.getBreakTime('<break time="3s"/>')).toBe(3000);
  });

  test('test getAudioSource', () => {
    expect(SSMLEvaluator.getAudioSource(exampleAudioSSML)).toBe('source');
  });

  test('test isAudioTag valid input', () => {
    expect(SSMLEvaluator.getAudioSource(exampleAudioSSML)).toBeTruthy();
  });

  test('test isAudioTag invalid input', () => {
    expect(SSMLEvaluator.getAudioSource('hello<break time="3s"/>')).toBeFalsy();
  });

  test('test isSupportedTag audio', () => {
    expect(SSMLEvaluator.isSupportedTag(exampleAudioSSML)).toBeTruthy();
  });

  test('test isSupportedTag break', () => {
    expect(SSMLEvaluator.isSupportedTag(exampleBreakSSML)).toBeTruthy();
  });

  test('test getTag audio', () => {
    expect(SSMLEvaluator.getTag(exampleAudioSSML)).toBe('audio');
  });

  test('test getTag break', () => {
    expect(SSMLEvaluator.getTag(exampleBreakSSML)).toBe('break');
  });

  test('test isPlainText valid input', () => {
    expect(SSMLEvaluator.isPlainText(examplePlainText)).toBeTruthy();
  });

  test('test isPlainText invalid input', () => {
    expect(SSMLEvaluator.isPlainText(exampleAudioSSML)).toBeFalsy();
  });
});
