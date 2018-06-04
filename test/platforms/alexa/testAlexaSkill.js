'use strict';
const assert = require('chai').assert;
const expect = require('chai').expect;

const RequestBuilderAlexaSkill = require('../../../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;

const webhookAlexaIntentRequestResponseJSON = '{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":2006,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8664,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":"~socket","connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"content-type":"application/json; charset=utf-8","accept":"application/json","accept-charset":"utf-8","signature":"aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","content-length":"1290","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.x (Java/1.8.0_112)","x-forwarded-proto":"https","x-forwarded-for":"72.21.217.175"},"rawHeaders":["Content-Type","application/json; charset=utf-8","Accept","application/json","Accept-Charset","utf-8","Signature","aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","SignatureCertChainUrl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","Content-Length","1290","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.x (Java/1.8.0_112)","X-Forwarded-Proto","https","X-Forwarded-For","72.21.217.175"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~","body":{"version":"1.0","session":{"new":true,"sessionId":"amzn1.echo-api.session.ce892f42-d6be-4097-a684-6f01f1bf31be","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"AudioPlayer":{"playerActivity":"STOPPED"},"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"LaunchRequest","requestId":"amzn1.echo-api.request.4812a2af-8a96-47fb-9c1d-00b46c85cb12","timestamp":"2017-06-12T15:41:07Z","locale":"en-US"}},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}},"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":"~"},"connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~socket~parser~incoming","locals":{}}';
let response = JSON.parse(webhookAlexaIntentRequestResponseJSON);

const simpleIntentSample = require('../../../lib/platforms/alexaSkill/request/samples/intentRequestSample2.json');
const App = require('../../../lib/app').App;
const BaseApp = require('../../../lib/app');


// workaround
response.json = function(json) {};


describe('alexaSkill()', function() {
    it('should be type of object', function(done) {
        let app = new App();

        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent');


        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                assert(typeof this.alexaSkill() === 'object', 'typeof object');
                assert(this.getPlatform().constructor.name === 'AlexaSkill');
                done();
            },
        });
    });

    it('getIntentName() - should return the correct intent name', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample);
        request.setIntentName('HelloWorldIntent');

        app.on('respond', function(jovo) {
            let response = jovo.getPlatform().getResponse();
            assert.ok(response.isTell('HelloWorldIntent'));
            done();
        });
        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                this.tell(this.alexaSkill().getIntentName());
            },
        });
    });

    it('getIntentName() - should return error when launch request', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .launchRequest();

        app.handleRequest(request.buildHttpRequest(), response, {
            'LAUNCH': function() {
                assert.throws(
                    () => {
                        this.alexaSkill().getIntentName();
                    },
                    Error,
                    'this.request.getIntentName is not a function'
                );
                done();
            },
        });
    });
    it('getIntentName() - should return error when session ended request', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .sessionEndedRequest();

        app.handleRequest(request.buildHttpRequest(), response, {
            'END': function() {
                assert.throws(
                    () => {
                        this.alexaSkill().getIntentName();
                    },
                    Error,
                    'this.request.getIntentName is not a function'
                );
                done();
            },
        });
    });
    it('getInputs() - should return empty object', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent');


        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getInputs()).to.be.empty;
                done();
            },
        });
    });
    it('getInputs() - should return object with two inputs', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .addSlot('foo', 'bar')
            .addSlot('test', 'ok');


        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getInputs()).to.have.property('foo');
                expect(this.alexaSkill().getInputs().foo).to.deep.include({
                            name: 'foo',
                            value: 'bar',
                });

                expect(this.alexaSkill().getInputs()).to.have.property('test');
                expect(this.alexaSkill().getInputs().test).to.deep.include({
                    name: 'test',
                    value: 'ok',
                });
                done();
            },
        });
    });
    it('getInput(name) - should return undefined for non existing input', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent');


        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getInput('foo')).to.be.an('undefined');
                done();
            },
        });
    });

    it('getInput(name) - should return input value', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .addSlot('foo', 'bar');


        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getInput('foo')).to.deep.include({
                    name: 'foo',
                    value: 'bar',
                });
                done();
            },
        });
    });
    it('getUserId() - should return correct userId', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setUserId('random-user-id');


        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getUserId()).to.equal('random-user-id');
                done();
            },
        });
    });
    it('getLocale() - should return correct locale', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setLocale('de-DE');


        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getLocale()).to.equal('de-DE');
                done();
            },
        });
    });
    it('getAccessToken() - should return correct access token', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setAccessToken('random-access-token');


        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getAccessToken()).to.equal('random-access-token');
                done();
            },
        });
    });

    it('isNewSession() - should return correct value from launch request', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .launchRequest();

        app.handleRequest(request.buildHttpRequest(), response, {
            'LAUNCH': function() {
                expect(this.alexaSkill().isNewSession()).to.equal(true);
                done();
            },
        });
    });
    it('isNewSession() - should return correct value from intent request', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setSessionNew(false);

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().isNewSession()).to.equal(false);
                done();
            },
        });
    });
    it('getTimestamp() - should return correct timestamp', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setTimestamp('2015-05-13T12:34:56Z');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getTimestamp()).to.equal('2015-05-13T12:34:56Z');
                done();
            },
        });
    });
    it('hasAudioInterface() returns true if device supports audio', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setSupportedInterfaces({
                AudioPlayer: {},
            });

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().hasAudioInterface()).to.equal(true);
                done();
            },
        });
    });
    it('hasAudioInterface() returns true if device supports audio', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setSupportedInterfaces({
                AudioPlayer: {},
                Display: {
                    templateVersion: '1.0',
                    markupVersion: '1.0',
                },
                VideoApp: {},
            });

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().hasAudioInterface()).to.equal(true);
                done();
            },
        });
    });
    it('hasAudioPlayerInterface() returns true if device supports audio player', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setSupportedInterfaces({
                AudioPlayer: {},
            });

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().hasAudioPlayerInterface()).to.equal(true);
                expect(this.alexaSkill().hasScreenInterface()).to.equal(false);
                expect(this.alexaSkill().hasVideoInterface()).to.equal(false);
                done();
            },
        });
    });
    it('hasScreenInterface() returns true if device supports a screen', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setSupportedInterfaces({
                AudioPlayer: {},
                Display: {
                    templateVersion: '1.0',
                    markupVersion: '1.0',
                },
                VideoApp: {},
            });

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().hasScreenInterface()).to.equal(true);
                done();
            },
        });
    });
    it('hasVideoInterface() returns true if device supports video apps', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setSupportedInterfaces({
                AudioPlayer: {},
                Display: {
                    templateVersion: '1.0',
                    markupVersion: '1.0',
                },
                VideoApp: {},
            });

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().hasVideoInterface()).to.equal(true);
                done();
            },
        });
    });

    it('getDeviceId() - should return correct device id', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setDeviceId('any-device-id');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getDeviceId()).to.equal('any-device-id');
                done();
            },
        });
    });
    it('getApplicationId() - should return correct application/skill id', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setApplicationId('any-application-id');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getApplicationId()).to.equal('any-application-id');
                done();
            },
        });
    });

    it('getRawText() - should return correct value ', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('CatchAllIntent')
            .addSlot('catchAll', 'This is a test');

        app.handleRequest(request.buildHttpRequest(), response, {
            'CatchAllIntent': function() {
                expect(this.alexaSkill().getRawText()).to.equal('This is a test');
                done();
            },
        });
    });

    it('getRawText() - should return error ', function(done) {
        this.timeout(250);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('CatchAllIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'CatchAllIntent': function() {
                assert.throws(
                    () => {
                        this.alexaSkill().getRawText();
                    },
                    Error,
                    'Only available with catchAll slot'
                );
                done();
            },
        });
    });

    it.skip('getSelctedElementId() - should return correct element id ', function(done) {
    });

    it('getRequest() - should return request object ', function(done) {
        let app = new App();
        this.timeout(250);

        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample);

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getRequest()).to.deep.equal(simpleIntentSample);
                done();
            },
        });
    });

    it('should return ALEXA_SKILL as platformtype', function(done) {
        let app = new App();
        this.timeout(250);

        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                assert(this.alexaSkill().getType() === BaseApp.PLATFORM_ENUM.ALEXA_SKILL, 'ALEXA_SKILL');
                done();
            },
        });
    });
    it('should return empty session attribute object', function(done) {
        let app = new App();
        this.timeout(250);

        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getSessionAttributes()).to.be.empty;
                done();
            },
        });
    });
    it('should return session attributes object', function(done) {
        let app = new App();
        this.timeout(250);

        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setSessionAttributes({
                foo: {
                    test: 'value',
                },
                var1: 'val1',
            });

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getSessionAttributes()).to.deep.equal({
                    foo: {
                        test: 'value',
                    },
                    var1: 'val1',
                });

                done();
            },
        });
    });
    it('should return session attribute by key', function(done) {
        let app = new App();
        this.timeout(250);

        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setSessionAttributes({
                foo: {
                    test: 'value',
                },
                var1: 'val1',
            });

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getSessionAttribute('foo')).to.deep.equal({
                        test: 'value',
                });
                done();
            },
        });
    });
    it('should return undefined session attribute', function(done) {
        let app = new App();
        this.timeout(250);

        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setSessionAttributes({
                var1: 'val1',
            });

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                expect(this.alexaSkill().getSessionAttribute('foo')).is.an('undefined');
                done();
            },
        });
    });

    it('getState() - should return the correct state', function(done) {
        let app = new App();
        this.timeout(250);

        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent')
            .setState('State1');

        app.handleRequest(request.buildHttpRequest(), response, {
            'State1': {
                'HelloWorldIntent': function() {
                    expect(this.alexaSkill().getState()).is.equal('State1');
                    done();
                },
            },
        });
    });
    it('getState() - should return undefined ', function(done) {
        let app = new App();
        this.timeout(250);

        let request = RequestBuilderAlexaSkill
            .intentRequest(simpleIntentSample)
            .setIntentName('HelloWorldIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                    expect(this.alexaSkill().getState()).is.an('undefined');
                    done();
                },
        });
    });
});
