'use strict';
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
            assert(speech.build() === 'Hey <break time="300ms"/> What is your name? <audio src="https://any.url.com/file.mp3"/>', 'concatenated string');
        });
    });

    describe('add on condition ', function() {
        it('should return a output based on condition', function() {
            let speech = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.ALEXA_SKILL))
                .addText('Hey')
                .addBreak('300ms', false)
                .addText('What is your name?', false)
                .addText('Your name?', true)
                .addAudio('https://any.url.com/file.mp3');
            assert.ok(speech.build() === 'Hey Your name? <audio src="https://any.url.com/file.mp3"/>');
        });
    });

    describe('array as parameter. ', function() {
        it('should return one of the three values', function() {
            let speech = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.ALEXA_SKILL))
                .addText(['Hey', 'Hi', 'Hello']);
            assert.ok(speech.build() === 'Hey' ||
                speech.build() === 'Hi' ||
                speech.build() === 'Hello');

            let speech2 = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.ALEXA_SKILL))
                .addBreak(['100ms', '1s', '500ms']);
            assert.ok(speech2.build() === '<break time="100ms"/>' ||
                speech2.build() === '<break time="1s"/>' ||
                speech2.build() === '<break time="500ms"/>');

            let speech3 = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.ALEXA_SKILL))
                .addAudio(['url1', 'url2', 'url3']);
            assert.ok(speech3.build() === '<audio src="url1"/>' ||
                speech3.build() === '<audio src="url2"/>' ||
                speech3.build() === '<audio src="url3"/>');

            let speech4 = (new Jovo.SpeechBuilder(Jovo.PLATFORM_ENUM.GOOGLE_ACTION))
                .addAudio(
                    [
                        'url1',
                        'url2',
                        'url3',
                    ],
                    [
                        'text1',
                        'text2',
                        'text3',
                    ]);
            assert.ok(speech4.build() === '<audio src="url1">text1</audio>' ||
                speech4.build() === '<audio src="url2">text2</audio>' ||
                speech4.build() === '<audio src="url3">text3</audio>');
        });
    });
});
