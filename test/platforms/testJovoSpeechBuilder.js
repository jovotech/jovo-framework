'use strict';
let assert = require('chai').assert;
let AlexaSpeechBuilder = require('../../index').AlexaSkill.AlexaSpeechBuilder;

let GoogleActionSpeechBuilder = require('../../index').GoogleAction.GoogleActionSpeechBuilder;
let SpeechBuilder = require('../../lib/platforms/speechBuilder').SpeechBuilder;
const RequestBuilderAlexaSkill = require('../../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;

const webhookAlexaIntentRequestResponseJSON = '{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":2006,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8664,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":"~socket","connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"content-type":"application/json; charset=utf-8","accept":"application/json","accept-charset":"utf-8","signature":"aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","content-length":"1290","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.x (Java/1.8.0_112)","x-forwarded-proto":"https","x-forwarded-for":"72.21.217.175"},"rawHeaders":["Content-Type","application/json; charset=utf-8","Accept","application/json","Accept-Charset","utf-8","Signature","aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","SignatureCertChainUrl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","Content-Length","1290","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.x (Java/1.8.0_112)","X-Forwarded-Proto","https","X-Forwarded-For","72.21.217.175"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~","body":{"version":"1.0","session":{"new":true,"sessionId":"amzn1.echo-api.session.ce892f42-d6be-4097-a684-6f01f1bf31be","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"AudioPlayer":{"playerActivity":"STOPPED"},"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"LaunchRequest","requestId":"amzn1.echo-api.request.4812a2af-8a96-47fb-9c1d-00b46c85cb12","timestamp":"2017-06-12T15:41:07Z","locale":"en-US"}},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}},"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":"~"},"connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~socket~parser~incoming","locals":{}}';
let response = JSON.parse(webhookAlexaIntentRequestResponseJSON);
const App = require('../../lib/app').App;

// workaround
response.json = function(json) {};

describe('SpeechBuilder Class', function() {
    describe('constructor', function() {
        it('should return empty string', function() {
            assert(new SpeechBuilder().build() === '', 'Speechbuilder is empty on initialization');
        });
    });

    describe('toSSML', function() {
        it('should return ssml string with <speak> tags', function() {
            let speech = SpeechBuilder.toSSML('test');
            assert(speech === '<speak>test</speak>', 'valid ssml');
        });

        it('should return ssml string without duplicate <speak> tags', function() {
            let speech = SpeechBuilder.toSSML('<speak>test</speak>');
            assert(speech === '<speak>test</speak>', 'valid ssml');
        });
    });

    describe('addAudio', function() {
        it('should return valid audio tag (alexa skill)', function() {
            let speech = (new AlexaSpeechBuilder()).addAudio('https://any.url.com/file.mp3');
            assert(speech.build() === '<audio src="https://any.url.com/file.mp3"/>', 'valid audio tag');
        });

        it('should return valid audio tag (google action)', function() {
            let speech = (new GoogleActionSpeechBuilder()).addAudio('https://any.url.com/file.mp3', 'text');
            assert(speech.build() === '<audio src="https://any.url.com/file.mp3">text</audio>', 'valid audio tag');
        });
    });


    describe('addText', function() {
        it('should return text with given string', function() {
            assert((new AlexaSpeechBuilder()).addText('Test').build() === 'Test', 'valid text');
        });

        it('should return two text snippets seperated with a blank space', function() {
            let speech = (new SpeechBuilder())
                .addText('Test1')
                .addText('Test2');
            assert(speech.build() === 'Test1 Test2', 'valid text');
        });
    });

    describe('addBreak', function() {
        it('should return a valid ssml break tag', function() {
            let speech = (new SpeechBuilder())
                .addBreak('300ms');
            assert(speech.build() === '<break time="300ms"/>', 'valid break tag');
        });
    });

    describe('concatenation ', function() {
        it('should return a concatenated string', function() {
            let speech = (new AlexaSpeechBuilder())
                .addText('Hey')
                .addBreak('300ms')
                .addText('What is your name?')
                .addAudio('https://any.url.com/file.mp3');
            assert(speech.build() === 'Hey <break time="300ms"/> What is your name? <audio src="https://any.url.com/file.mp3"/>', 'concatenated string');

            speech = (new GoogleActionSpeechBuilder())
                .addText('Hey')
                .addBreak('300ms')
                .addText('What is your name?')
                .addAudio('https://any.url.com/file.mp3', 'Text');
            assert(speech.build() === 'Hey <break time="300ms"/> What is your name? <audio src="https://any.url.com/file.mp3">Text</audio>', 'concatenated string');
        });
    });

    describe('add on condition ', function() {
        it('should return a output based on condition', function() {
            let speech = (new AlexaSpeechBuilder())
                .addText('Hey')
                .addBreak('300ms', false)
                .addText('What is your name?', false)
                .addText('Your name?', true)
                .addAudio('https://any.url.com/file.mp3');
            assert.ok(speech.build() === 'Hey Your name? <audio src="https://any.url.com/file.mp3"/>');
            // Google Action uses same base class functions
        });
    });

    describe('array as parameter. ', function() {
        it('should return one of the three values', function() {
            let speech = (new SpeechBuilder())
                .addText(['Hey', 'Hi', 'Hello']);
            assert.ok(speech.build() === 'Hey' ||
                speech.build() === 'Hi' ||
                speech.build() === 'Hello');


            let speech2 = (new SpeechBuilder())
                .addBreak(['100ms', '1s', '500ms']);
            assert.ok(speech2.build() === '<break time="100ms"/>' ||
                speech2.build() === '<break time="1s"/>' ||
                speech2.build() === '<break time="500ms"/>');


            let speech3 = (new AlexaSpeechBuilder())
                .addAudio(['url1', 'url2', 'url3']);
            assert.ok(speech3.build() === '<audio src="url1"/>' ||
                speech3.build() === '<audio src="url2"/>' ||
                speech3.build() === '<audio src="url3"/>');

            let speech4 = (new GoogleActionSpeechBuilder())
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

    describe('i18n helper ', function() {
        it('t()', function(done) {
            let languageResources = {
                'en-US': {
                    translation: {
                        WELCOME: 'Welcome',
                        WELCOME_WITH_PARAMETER: 'Welcome %s',
                    },
                },
                'de-DE': {
                    translation: {
                        WELCOME: 'Willkommen',
                        WELCOME_WITH_PARAMETER: 'Willkommen %s',
                    },
                },
            };
            let app = new App();

            this.timeout(1000);

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Welcome'));
                done();
            });
            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('NameIntent')
                .setLocale('en-US')
                .buildHttpRequest();
            app.setLanguageResources(languageResources);
            app.handleRequest(request, response, {
                'NameIntent': function() {
                    const sb = this.speechBuilder();
                    this.tell(sb.t('WELCOME'));
                },
            });
        });

        it('t() - with parameter', function(done) {
            let languageResources = {
                'en-US': {
                    translation: {
                        WELCOME: 'Welcome',
                        WELCOME_WITH_PARAMETER: 'Welcome %s',
                    },
                },
                'de-DE': {
                    translation: {
                        WELCOME: 'Willkommen',
                        WELCOME_WITH_PARAMETER: 'Willkommen %s',
                    },
                },
            };
            let app = new App();

            this.timeout(1000);

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Willkommen Joe'));
                done();
            });
            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('NameIntent')
                .setLocale('de-DE')
                .buildHttpRequest();

            app.setLanguageResources(languageResources);
            app.handleRequest(request, response, {
                'NameIntent': function() {
                    const sb = this.speechBuilder();
                    this.tell(sb.t('WELCOME_WITH_PARAMETER', 'Joe'));
                },
            });
        });
    });

    describe('addPhoneme ', () => {
        it('should add an x-sampa phoneme tag', () => {
            const speech = new SpeechBuilder();
            speech.addPhoneme('quote', '"kvo:t@', 'x-sampa');
            assert.equal(speech.build(), '<phoneme alphabet="x-sampa" ph="&quot;kvo:t@">quote</phoneme>');
        });

        it('should use ipa by default', () => {
            const speech = new SpeechBuilder();
            speech.addPhoneme('quote', 'ˈkvoːtə');
            assert.equal(speech.build(), '<phoneme alphabet="ipa" ph="ˈkvoːtə">quote</phoneme>');
        });

        it('should add plain text on google', () => {
            const speech = new GoogleActionSpeechBuilder();
            speech.addPhoneme('quote', 'ˈkvoːtə', 'ipa');
            assert.equal(speech.build(), 'quote');
        });
    });

    describe('addIpa ', () => {
        it('should add an ipa phoneme tag', () => {
            const speech = new SpeechBuilder();
            speech.addIpa('quote', 'ˈkvoːtə');
            assert.equal(speech.build(), '<phoneme alphabet="ipa" ph="ˈkvoːtə">quote</phoneme>');
        });

        it('should add plain text on google', () => {
            const speech = new GoogleActionSpeechBuilder();
            speech.addIpa('quote', 'ˈkvoːtə');
            assert.equal(speech.build(), 'quote');
        });
    });

    describe('addXSampa ', () => {
        it('should add an x-sampa phoneme tag', () => {
            const speech = new SpeechBuilder();
            speech.addXSampa('quote', '"kvo:t@');
            assert.equal(speech.build(), '<phoneme alphabet="x-sampa" ph="&quot;kvo:t@">quote</phoneme>');
        });

        it('should add plain text on google', () => {
            const speech = new GoogleActionSpeechBuilder();
            speech.addXSampa('quote', '"kvo:t@');
            assert.equal(speech.build(), 'quote');
        });
    });
});
