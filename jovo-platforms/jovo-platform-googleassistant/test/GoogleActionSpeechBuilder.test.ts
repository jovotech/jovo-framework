import { GoogleActionSpeechBuilder } from '../src/core/GoogleActionSpeechBuilder';

test('test audio tag', () => {
  const jovo = {};
  // @ts-ignore
  const sb = new GoogleActionSpeechBuilder(jovo);
  sb.addAudio('https://url.to/audio.mp3');
  expect(sb.toString()).toEqual('<audio src="https://url.to/audio.mp3"/>');
});

test('test audio tag with array', () => {
  const jovo = {};
  // @ts-ignore
  const sb = new GoogleActionSpeechBuilder(jovo);
  sb.addAudio(['https://url.to/audio.mp3', 'https://url.to/audio2.mp3']);
  expect(sb.toString()).toMatch(/^(<audio src=\"https:\/\/url\.to\/audio2?\.mp3\")/);
});
