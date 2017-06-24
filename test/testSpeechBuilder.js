let assert = require('chai').assert;
let Jovo = require('../lib/jovo');

describe('SpeechBuilder Class', function() {
    describe('constructor', function() {
        it('should return empty string', function() {
            let speechbuilder = new Jovo.SpeechBuilder(
                Jovo.PLATFORM_ENUM.ALEXA_SKILL
            );
            assert(speechbuilder.build() === '', 'Speechbuilder is empty on initialization');
        });
    });

    describe('toSSML', function() {
        it('should return ssml string with <speak> tags', function() {
            let speech = Jovo.SpeechBuilder.toSSML('test');
            assert(speech === '<speak>test</speak>', 'valid ssml');
        });

        it('should return ssml string without duplicate <speak> tags', function() {
            let speech = Jovo.SpeechBuilder.toSSML('<speak>test</speak>');
            assert(speech === '<speak>test</speak>', 'valid ssml');
        });
    });

    describe('addAudio', function() {
        it('should return valid audio tag (alexa skill)', function() {
            let speech = (new Jovo.SpeechBuilder(
                Jovo.PLATFORM_ENUM.ALEXA_SKILL))
                .addAudio('https://any.url.com/file.mp3');
            assert(speech.build() === '<audio src="https://any.url.com/file.mp3"/>', 'valid audio tag');
        });

        it('should return valid audio tag (google action)', function() {
            let speech = (new Jovo.SpeechBuilder(
                Jovo.PLATFORM_ENUM.GOOGLE_ACTION))
                .addAudio('https://any.url.com/file.mp3', 'text');
            assert(speech.build() === '<audio src="https://any.url.com/file.mp3">text</audio>', 'valid audio tag');
        });
    });

    describe('addAudio', function() {
        it('should return valid audio tag (alexa skill)', function() {
            let speech = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.ALEXA_SKILL))
                .addAudio('https://any.url.com/file.mp3');
            assert(speech.build() === '<audio src="https://any.url.com/file.mp3"/>', 'valid audio tag');
        });

        it('should return valid audio tag (google action)', function() {
            let speech = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.GOOGLE_ACTION))
                .addAudio('https://any.url.com/file.mp3', 'text');
            assert(speech.build() === '<audio src="https://any.url.com/file.mp3">text</audio>', 'valid audio tag');
        });
    });

    describe('addText', function() {
        it('should return text with given string', function() {
            let speech = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.ALEXA_SKILL))
                .addText('Test');
            assert(speech.build() === 'Test', 'valid text');
        });

        it('should return two text snippets seperated with a blank space', function() {
            let speech = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.GOOGLE_ACTION))
                .addText('Test1')
                .addText('Test2');
            assert(speech.build() === 'Test1 Test2', 'valid text');
        });
    });

    describe('addBreak', function() {
        it('should return a valid ssml break tag', function() {
            let speech = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.ALEXA_SKILL))
                .addBreak('300ms');
            assert(speech.build() === '<break time="300ms"/>', 'valid break tag');
        });
    });

    describe('concatenation ', function() {
        it('should return a concatenated string', function() {
            let speech = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.ALEXA_SKILL))
                .addText('Hey')
                .addBreak('300ms')
                .addText('What is your name?')
                .addAudio('https://any.url.com/file.mp3');
            assert(speech.build() === 'Hey<break time="300ms"/> What is your name?<audio src="https://any.url.com/file.mp3"/>', 'concatenated string');
        });
    });
});
