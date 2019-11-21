import { AlexaSpeechBuilder } from '../src/core/AlexaSpeechBuilder';

test('test audio tag', () => {
  const jovo = {};
  // @ts-ignore
  const sb = new AlexaSpeechBuilder(jovo);
  sb.addAudio('https://url.to/audio.mp3');
  expect(sb.toString()).toEqual('<audio src="https://url.to/audio.mp3"></audio>');
});

test('test audio tag with array', () => {
  const jovo = {};
  // @ts-ignore
  const sb = new AlexaSpeechBuilder(jovo);
  sb.addAudio(['https://url.to/audio.mp3', 'https://url.to/audio2.mp3']);
  expect(sb.toString()).toMatch(
    /^(<audio src="https:\/\/url.to\/audio.mp3">|<audio src="https:\/\/url.to\/audio2.mp3">)<\/audio>/,
  );
});

test('test lang tag', () => {
  const jovo = {};
  // @ts-ignore
  const sb = new AlexaSpeechBuilder(jovo);
  sb.addLangText('de', 'Hallo');
  expect(sb.toString()).toEqual('<lang xml:lang="de">Hallo</lang>');
});

test('test lang tag with array', () => {
  const jovo = {};
  // @ts-ignore
  const sb = new AlexaSpeechBuilder(jovo);
  sb.addLangText('de', ['Hallo', 'Guten Tag']);
  expect(sb.toString()).toMatch(
    /^(<lang xml:lang=\"de\">Hallo<\/lang>|<lang xml:lang=\"de\">Guten Tag<\/lang>)/,
  );
});

test('test voice tag', () => {
  const jovo = {};
  // @ts-ignore
  const sb = new AlexaSpeechBuilder(jovo);
  sb.addTextWithPolly('Hans', 'Hallo');
  expect(sb.toString()).toEqual('<voice name="Hans">Hallo</voice>');
});

test('test voice tag with array', () => {
  const jovo = {};
  // @ts-ignore
  const sb = new AlexaSpeechBuilder(jovo);
  sb.addTextWithPolly('Hans', ['Hallo', 'Guten Tag']);
  expect(sb.toString()).toMatch(
    /^(<voice name=\"Hans\">Hallo<\/voice>|<voice name=\"Hans\">Guten Tag<\/voice>)/,
  );
});
