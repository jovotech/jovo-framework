"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleActionSpeechBuilder_1 = require("../src/core/GoogleActionSpeechBuilder");
test('test audio tag', () => {
    const jovo = {};
    const sb = new GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder(jovo);
    sb.addAudio('https://url.to/audio.mp3');
    expect(sb.toString()).toEqual('<audio src="https://url.to/audio.mp3"/>');
});
test('test audio tag with array', () => {
    const jovo = {};
    const sb = new GoogleActionSpeechBuilder_1.GoogleActionSpeechBuilder(jovo);
    sb.addAudio(['https://url.to/audio.mp3', 'https://url.to/audio2.mp3']);
    expect(sb.toString()).toMatch(/^(<audio src=\"https:\/\/url\.to\/audio2?\.mp3\")/);
});
//# sourceMappingURL=GoogleActionSpeechBuilder.test.js.map