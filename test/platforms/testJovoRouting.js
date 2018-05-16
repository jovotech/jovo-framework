'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();


// let should = chai.should;
const App = require('../../lib/app').App;

const RequestBuilderAlexaSkill = require('../../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;

const webhookAlexaIntentRequestResponseJSON = '{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":2006,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8664,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":"~socket","connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"content-type":"application/json; charset=utf-8","accept":"application/json","accept-charset":"utf-8","signature":"aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","content-length":"1290","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.x (Java/1.8.0_112)","x-forwarded-proto":"https","x-forwarded-for":"72.21.217.175"},"rawHeaders":["Content-Type","application/json; charset=utf-8","Accept","application/json","Accept-Charset","utf-8","Signature","aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","SignatureCertChainUrl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","Content-Length","1290","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.x (Java/1.8.0_112)","X-Forwarded-Proto","https","X-Forwarded-For","72.21.217.175"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~","body":{"version":"1.0","session":{"new":true,"sessionId":"amzn1.echo-api.session.ce892f42-d6be-4097-a684-6f01f1bf31be","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"AudioPlayer":{"playerActivity":"STOPPED"},"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"LaunchRequest","requestId":"amzn1.echo-api.request.4812a2af-8a96-47fb-9c1d-00b46c85cb12","timestamp":"2017-06-12T15:41:07Z","locale":"en-US"}},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}},"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":"~"},"connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~socket~parser~incoming","locals":{}}';
let response = JSON.parse(webhookAlexaIntentRequestResponseJSON);

// workaround
response.json = function(json) {};
const util = require('../../lib/util');

describe('intent mapping', function() {
    for (let p of util.getPlatformRequestBuilder()) {
        it('should jump into REQUEST with async data (' + p.type() + ')', function(done) {
            let app = new App();

            let request = p.intent()
                .setIntentName('HelloWorldIntent');
            app.handleRequest(request.buildHttpRequest(), response, {
                'ON_REQUEST': function(done) {
                    setTimeout(() => {
                        this.toIntent('SecondIntent');
                        done();
                    }, 500);
                },
                'SecondIntent': function() {
                    done();
                },
            });
        });

        it('should jump into REQUEST with sync data (' + p.type() + ')', function(done) {
            let app = new App();

            let request = p.intent()
                .setIntentName('HelloWorldIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'ON_REQUEST': function() {
                    this.variableXYZ = 'from request';
                },
                'HelloWorldIntent': function() {
                    assert.ok(this.variableXYZ === 'from request');
                    done();
                },
            });
        });

        it('should jump into NEW_SESSION from launch request (' + p.type() + ')', function(done) {
            let app = new App();

            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setSessionNew(true);

            app.handleRequest(request.buildHttpRequest(), response, {
                'NEW_SESSION': function() {
                    this.variableXYZ = 'from session';
                },
                'HelloWorldIntent': function() {
                    assert.ok(this.variableXYZ === 'from session');
                    done();
                },
            });
        });
        it('should jump into NEW_SESSION from intent request (' + p.type() + ')', function(done) {
            let app = new App();

            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setSessionNew(true);

            app.handleRequest(request.buildHttpRequest(), response, {
                'NEW_SESSION': function() {
                    this.variableXYZ = 'from session';
                },
                'HelloWorldIntent': function() {
                    assert.ok(this.variableXYZ === 'from session');
                    done();
                },
            });
        });
        it('should jump from NEW_SESSION to an intent request (' + p.type() + ')', function(done) {
            let app = new App();

            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setSessionNew(true);

            app.handleRequest(request.buildHttpRequest(), response, {
                'NEW_SESSION': function() {
                    this.toIntent('HelloWorldIntent123');
                },
                'HelloWorldIntent123': function() {
                    done();
                },
            });
        });

        it('should jump into NEW_USER from launch request (' + p.type() + ')', function(done) {
            let app = new App();

            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setUserId('TEST_USER'+Math.random());

            app.on('respond', () => {
                done();
            });

            app.handleRequest(request.buildHttpRequest(), response, {
                'NEW_USER': function() {
                    this.tell('Hello new user');
                },
                'HelloWorldIntent': function() {
                },
            });
        });
        it('should jump into NEW_USER from intent request (' + p.type() + ')', function(done) {
            let app = new App();

            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setUserId('TEST_USER'+Math.random());

            app.on('respond', () => {
                done();
            });

            app.handleRequest(request.buildHttpRequest(), response, {
                'NEW_USER': function() {
                    this.tell('Hello new user');
                },
                'HelloWorldIntent': function() {
                },
            });
        });

        it('should jump into LAUNCH (' + p.type() + ')', function(done) {
            let app = new App();

            let request = p.launch();

            app.handleRequest(request.buildHttpRequest(), response, {
                'LAUNCH': function() {
                    done();
                },
            });
        });

        it('should return mapped intent (custom) (' + p.type() + ')', function(done) {
            let app = new App({
                intentMap: {
                    'NameIntent': 'HelloWorldIntent',
                },
            });
            let request = p.intent()
                .setIntentName('NameIntent');

            app.setHandler({
                'HelloWorldIntent': function() {
                    assert(
                        this.getIntentName() === 'HelloWorldIntent',
                        'Intent mapped correctly');
                    done();
                },
            });
            app.handleRequest(request.buildHttpRequest(), response);
        });


        it('should go to END on "end requests" (' + p.type() + ')', function(done) {
            let app = new App();
            let request = p.end();

            app.setHandler({
                'END': function() {
                    done();
                },
            });
            app.handleRequest(request.buildHttpRequest(), response);
        });
    }

    // alexa specifc
    it('should return mapped intent (standard)', function(done) {
        let app = new App();

        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('AMAZON.StopIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'END': function() {
                assert(
                    this.getIntentName() === 'END',
                    'Standard intent mapping failed');
                done();
            },
        });
    });
});


describe('followUpState', function() {
    for (let p of util.getPlatformRequestBuilder()) {
        it('should set the session attribute STATE with the given state (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = p.intent()
                .setIntentName('HelloWorldIntent');

            app.on('respond', (jovo) => {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World!'));
                assert.ok(response.hasState('TestState'));
                done();
            });
            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    assert.throws(
                        () => {
                            this.followUpState('TestStateABC').tell('Hello World!');
                        },
                        Error,
                        'State TestStateABC could not be found in your handler'
                    );
                    this.followUpState('TestState').tell('Hello World!');
                },
                'TestState': {
                    'OtherIntent': function(arg) {
                        // do nothing
                    },
                },
            });
        });

        it('should go to an intent inside the follow up state (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World'));
                done();
            });


            let request = p.intent()
                .setIntentName('YesIntent')
                .setState('TestState');
            app.handleRequest(request.buildHttpRequest(), response, {
                'YesIntent': function() {
                    // should not go here
                },
                'TestState': {
                    'YesIntent': function() {
                        this.tell('Hello World');
                    },
                },
            });
        });
    }
});

describe('Unhandled', function() {
    for (let p of util.getPlatformRequestBuilder()) {
        it('should go to a global intent when in a state (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Help'));
                done();
            });

            let request = p.intent()
                .setIntentName('HelpIntent')
                .setState('TestState');

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelpIntent': function() {
                    this.tell('Help');
                },
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.tell('Hello World');
                    },
                },
            });
        });

        it('should go to unhandled intent in a state (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Unhandled'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelpIntent')
                .setState('TestState');

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorld': function() {
                    this.tell('Help');
                },
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.tell('Hello World');
                    },
                    'Unhandled': function() {
                        this.tell('Unhandled');
                    },
                },
            });
        });

        it('should go to unhandled intent globally (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Global-Unhandled'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelpIntent')
                .setState('TestState');

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorld': function() {
                    this.tell('Help');
                },
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.tell('Hello World');
                    },
                },
                'Unhandled': function() {
                    this.tell('Global-Unhandled');
                },
            });
        });

        it('should go to unhandled state intent (with a global unhandled intent) (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('State-Unhandled'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelpIntent')
                .setState('TestState');


            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorld': function() {
                    this.tell('Help');
                },
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.tell('Hello World');
                    },
                    'Unhandled': function() {
                        this.tell('State-Unhandled');
                    },
                },
                'Unhandled': function() {
                    app.tell('Global-Unhandled');
                },
            });
        });
        it('should reset state and jump to intent in the global handler (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World'));

                assert.ok(response.hasState(null));
                done();
            });

            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setState('TestState');

            app.handleRequest(request.buildHttpRequest(), response, {
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.followUpState(null).tell('Hello World');
                    },
                },
            });
        });
    }
});

describe('toIntent', function() {
    for (let p of util.getPlatformRequestBuilder()) {
        it('should skip the intent from the request and call the intent in the arguments', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello John Doe'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelloWorldIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    let that = this;
                    assert.throws(
                        () => {
                            that.toIntent('OtherIntents', 'John Doe');
                        },
                        Error,
                        'OtherIntents could not be found in your handler'
                    );

                    this.toIntent('OtherIntent', 'John Doe');
                },
                'OtherIntent': function(arg) {
                    this.tell('Hello ' + arg);
                },
            });
        });

        it('should skip the intent from the request and call the intent in the arguments + input arguments', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello John. You are 45 years old.'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .addInput('name', 'John')
                .addInput('age', 45);

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function(name, age) {
                    assert.throws(
                        () => {
                            this.toIntent('OtherIntents', name, age);
                        },
                        Error,
                        'OtherIntents could not be found in your handler'
                    );

                    this.toIntent('OtherIntent', name, age, 'arg2');
                },
                'OtherIntent': function(name, age) {
                    this.tell('Hello ' + name.value + '. You are ' + age.value + ' years old.');
                },
            });
        });

        it('should jump to intent inside the state handler', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setState('TestState');

            app.handleRequest(request.buildHttpRequest(), response, {
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.toIntent('OtherIntent');
                    },
                    'OtherIntent': function() {
                        this.tell('Hello World');
                    },
                },
            });
        });

        it('should jump to intent in the global handler', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setState('TestState');

            app.handleRequest(request.buildHttpRequest(), response, {
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.toIntent('OtherIntent');
                    },
                },
                'OtherIntent': function() {
                    this.tell('Hello World');
                },
            });
        });
    }
});

describe('toStateIntent', function() {
    for (let p of util.getPlatformRequestBuilder()) {
        it('should skip the intent from the request and call the state-intent in the arguments', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello John. You are 45 years old.'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .addInput('name', 'John')
                .addInput('age', 45);

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function(name, age) {
                    assert.throws(
                        () => {
                            this.toStateIntent('TestStateABC', 'OtherIntents', 'John Doe');
                        },
                        Error,
                        'Route TestStateABC.OtherIntents could not be found in your handler'
                    );

                    assert.throws(
                        () => {
                            this.toStateIntent('TestState', 'OtherIntents', 'John Doe');
                        },
                        Error,
                        'Route TestState.OtherIntents could not be found in your handler'
                    );
                    this.toStateIntent('TestState', 'OtherIntent', name, age);
                },
                'TestState': {
                    'OtherIntent': function(name, age) {
                        this.tell('Hello ' + name.value + '. You are ' + age.value + ' years old.');
                    },
                },
            });
        });

        it('should skip the intent from the request and call the state-intent in the arguments + input arguments', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello John Doe'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelloWorldIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    assert.throws(
                        () => {
                            this.toStateIntent('TestStateABC', 'OtherIntents', 'John Doe');
                        },
                        Error,
                        'Route TestStateABC.OtherIntents could not be found in your handler'
                    );

                    assert.throws(
                        () => {
                            this.toStateIntent('TestState', 'OtherIntents', 'John Doe');
                        },
                        Error,
                        'Route TestState.OtherIntents could not be found in your handler'
                    );
                    this.toStateIntent('TestState', 'OtherIntent', 'John Doe');
                },
                'TestState': {
                    'OtherIntent': function(arg) {
                        this.tell('Hello ' + arg);
                    },
                },
            });
        });
        it('should jump to intent in the global handler', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setState('TestState');

            app.handleRequest(request.buildHttpRequest(), response, {
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.toStateIntent(null, 'OtherIntent');
                    },
                },
                'OtherIntent': function() {
                    this.tell('Hello World');
                },
            });
        });

        it('should jump to intent in the global handler (toStatelessIntent)', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setState('TestState');

            app.handleRequest(request.buildHttpRequest(), response, {
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.toStatelessIntent('OtherIntent');
                    },
                },
                'OtherIntent': function() {
                    this.tell('Hello World');
                },
            });
        });

        it('should jump to intent in the global handler (toGlobalIntent)', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World'));
                done();
            });


            let request = p.intent()
                .setIntentName('HelloWorldIntent')
                .setState('TestState');

            app.handleRequest(request.buildHttpRequest(), response, {
                'TestState': {
                    'HelloWorldIntent': function() {
                        this.toStatelessIntent('OtherIntent');
                    },
                },
                'OtherIntent': function() {
                    this.tell('Hello World');
                },
            });
        });
    }
});

describe('toStatelessIntent', function() {
    for (let p of util.getPlatformRequestBuilder()) {
        it('should successfully jump into the stateless intent', function(done) {
            this.timeout(1000);
            let app = new App();

            let request = p.intent()
                .setState('State1')
                .setIntentName('LaunchIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'State1': {
                    'LaunchIntent': function() {
                        this.toStatelessIntent('TestIntent');
                    },

                    'TestIntent': function() {
                    },
                },

                'TestIntent': function() {
                    done();
                },
            });
        });

        it('should jump to global UnhandledIntent if stateless intent does not exist', function(done) {
            this.timeout(1000);
            let app = new App();

            let request = p.intent()
                .setState('State1')
                .setIntentName('LaunchIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'State1': {
                    'LaunchIntent': function() {
                        this.toStatelessIntent('TestIntent');
                    },

                    'TestIntent': function() {
                    },
                },

                'Unhandled': function() {
                    done();
                },
            });
        });

        it('should throw an error if the intent and UnhandledIntent are not defined', function(done) {
            this.timeout(1000);
            let app = new App();

            let request = p.intent()
                .setState('State1')
                .setIntentName('LaunchIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'State1': {
                    'LaunchIntent': function() {
                        expect(() => {
                            this.toStatelessIntent('Test1Intent', 'John Doe');
                        }).to.throw('Route Test1Intent could not be found in your handler');
                        done();
                    },

                    'TestIntent': function() {
                    },
                },

                'TestIntent': function() {
                },
            });
        });

        it('should pass data to stateless intent', function(done) {
            this.timeout(1000);
            let app = new App();

            let request = p.intent()
                .setState('State1')
                .setIntentName('LaunchIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'State1': {
                    'LaunchIntent': function() {
                        this.toStatelessIntent('TestIntent', {name: 'John'});
                    },

                    'TestIntent': function() {
                    },
                },

                'TestIntent': function(data) {
                    expect(data.name).to.equal('John');
                    done();
                },

                'Unhandled': function() {
                },
            });
        });
    }
});

describe('StateStacking', function() {
    describe('toStateIntent', function() {
        for (let p of util.getPlatformRequestBuilder()) {
            it('should look for a local state and jump into it', function(done) {
                this.timeout(1000);

                let app = new App();

                let request = p.intent()
                    .setState('State1')
                    .setIntentName('TestIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'State1': {
                        'TestIntent': function() {
                            this.toStateIntent('State1.State11', 'TestIntent');
                        },

                        'State11': {
                            'TestIntent': function() {
                                done();
                            },
                        },
                    },

                    'State11': {
                        'TestIntent': function() {
                        },
                    },
                });
            });

            it('should exit the current state to jump into the stacked state', function(done) {
                this.timeout(1000);

                let app = new App();

                let request = p.intent()
                    .setState('State1')
                    .setIntentName('TestIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'State1': {
                        'TestIntent': function() {
                            this.toStateIntent('State2.State21', 'TestIntent');
                        },
                    },

                    'State2': {
                        'TestIntent': function() {
                        },
                        'State21': {
                            'TestIntent': function() {
                                done();
                            },
                        },
                    },
                });
            });

            it('should throw an error if state doesn\'t exist', function(done) {
                this.timeout(1000);

                let app = new App();

                let request = p.intent()
                    .setState('State1')
                    .setIntentName('TestIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'State1': {
                        'TestIntent': function() {
                            expect(() => {
                                this.toStateIntent('State2.State21', 'TestIntent');
                            }).to.throw('Route State2.State21.TestIntent could not be found in your handler');
                            done();
                        },
                    },
                });
            });

            it('should pass data to state stack', function(done) {
                this.timeout(1000);

                let app = new App();

                let request = p.intent()
                    .setState('State1')
                    .setIntentName('TestIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'State1': {
                        'TestIntent': function() {
                            this.toStateIntent('State1.State11', 'TestIntent', {name: 'John'});
                        },

                        'State11': {
                            'TestIntent': function(data) {
                                expect(data.name).to.equal('John');
                                done();
                            },
                        },
                    },
                });
            });
        }
    });

    describe('followUpState', function() {
        for (let p of util.getPlatformRequestBuilder()) {
            it('should look for a local state and jump into it', function(done) {
                this.timeout(1000);

                let app = new App();

                let request = p.intent()
                    .setState('State1')
                    .setIntentName('TestIntent');

                app.handleRequest(request.buildHttpRequest(), response, {

                    'State1': {
                        'TestIntent': function() {
                            this.followUpState('State1.State11').tell('Hello World.');
                        },

                        'State11': {
                            'TestIntent': function() {
                            },
                        },
                    },
                });

                app.on('respond', (jovo) => {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isTell('Hello World.'));
                    assert.ok(response.hasState('State1.State11'));
                    done();
                });
            });

            it('should exit the current state to jump into the stacked state', function(done) {
                this.timeout(1000);

                let app = new App();

                let request = p.intent()
                    .setState('State1')
                    .setIntentName('TestIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'State1': {
                        'TestIntent': function() {
                            this.followUpState('State2.State21').tell('Hello World.');                          // TODO test ask?
                        },
                    },

                    'State2': {
                        'TestIntent': function() {
                        },
                        'State21': {},
                    },
                });

                app.on('respond', (jovo) => {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isTell('Hello World.'));
                    assert.ok(response.hasState('State2.State21'));
                    done();
                });
            });

            it('should throw error if state doesn\'t exist', function(done) {
                this.timeout(1000);

                let app = new App();

                let request = p.intent()
                    .setState('State1')
                    .setIntentName('TestIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'State1': {
                        'TestIntent': function() {
                            expect(() => {
                                this.followUpState('State2.State11').tell('Hello World.');
                            }).to.throw('State State2.State11 could not be found in your handler');
                            done();
                        },

                        'State11': {
                            'TestIntent': function() {
                            },
                        },
                    },
                });
            });
        }
    });
});

describe('intentsToSkipUnhandled', function() {
    for (let p of util.getPlatformRequestBuilder()) {
        it('should skip the local UnhandledIntent and jump right into the global HelpIntent', function(done) {
            this.timeout(1000);

            let app = new App({
                intentsToSkipUnhandled: [
                    'HelpIntent',
                ],
            });

            let request = p.intent()
                .setState('State1')
                .setIntentName('HelpIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'State1': {
                    'TestIntent': function() {
                    },

                    'Unhandled': function() {
                    },
                },

                'HelpIntent': function() {
                    done();
                },
            });
        });

        it('should skip the global UnhandledIntent and jump right into the global HelpIntent', function(done) {
            this.timeout(1000);
            let app = new App({
                intentsToSkipUnhandled: [
                    'HelpIntent',
                ],
            });

            let request = p.intent()
                .setState('State1')
                .setIntentName('HelpIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'State1': {
                    'TestIntent': function() {},

                    'Unhandled': function() {},
                },

                'HelpIntent': function() {
                    done();
                },

                'Unhandled': function() {
                },
            });
        });

        it('should jump into UnhandledIntent if intent is not defined', function(done) {
            this.timeout(1000);
            let app = new App({
                intentsToSkipUnhandled: [
                    'HelpIntent',
                ],
            });

            let request = p.intent()
                .setState('State1')
                .setIntentName('HelpIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'State1': {
                    'TestIntent': function() {
                    },
                },

                'Unhandled': function() {
                    done();
                },
            });
        });
    }
});


describe('Unhandled Intents', function() {
    for (let p of util.getPlatformRequestBuilder()) {
        it('should jump to Unhandled intent when no intent defined (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('TestIntent');
            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Unhandled'));
                done();
            });
            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    this.tell('HelloWorld');
                },
                'Unhandled': function() {
                    this.tell('Unhandled');
                },
            });
        });

        it('should jump to Unhandled intent inside a state when no intent defined (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = p.intent()
                .setState('TestState')
                .setIntentName('TestIntent');
            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Unhandled'));
                done();
            });
            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    this.tell('HelloWorld');
                },
                'TestState': {
                    'Unhandled': function() {
                        this.tell('Unhandled');
                    },
                },
            });
        });

        it('should throw an error if TestIntent is not defined (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = p.intent()
                .setIntentName('TestIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    this.tell('HelloWorld');
                },
            }).catch((error) => {
                assert.ok(error.message === 'Could not find the route "TestIntent" in your handler function.');
                done();
            });
        });

        it('should jump to a global TestIntent if there is no TestIntent in TestState (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = p.intent()
                .setIntentName('TestIntent')
                .setState('TestState');

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Global TestIntent'));
                done();
            });

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    this.tell('HelloWorld');
                },
                'TestIntent': function() {
                    this.tell('Global TestIntent');
                },
                'TestState': {
                    'AnyIntent': function() {
                        this.tell('AnyIntent');
                    },
                },
            });
        });

        it('should jump to the state Unhandled even if there is a global TestIntent (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = p.intent()
                .setIntentName('TestIntent')
                .setState('TestState');

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Unhandled'));
                done();
            });

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    this.tell('HelloWorld');
                },
                'TestIntent': function() {
                    this.tell('Global TestIntent');
                },
                'TestState': {
                    'Unhandled': function() {
                        this.tell('Unhandled');
                    },
                },
            });
        });

        it('should jump to the state Unhandled two levels below (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = p.intent()
                .setIntentName('TestIntent')
                .setState('TestState1.TestState2.TestState3');

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Unhandled TestState1'));
                done();
            });

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    this.tell('HelloWorld');
                },
                'TestIntent': function() {
                    this.tell('Global TestIntent');
                },
                'TestState1': {
                    'Unhandled': function() {
                        this.tell('Unhandled TestState1');
                    },
                    'TestState2': {
                        'TestState3': {
                        },
                    },
                },
            });
        });
        it('should jump to the TestIntent in global (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = p.intent()
                .setIntentName('TestIntent')
                .setState('TestState1.TestState2.TestState3');

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Global TestIntent'));
                done();
            });

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    this.tell('HelloWorld');
                },
                'TestIntent': function() {
                    this.tell('Global TestIntent');
                },
                'TestState1': {
                    'TestState2': {
                        'TestState3': {
                        },
                    },
                },
            });
        });

        it('should jump to unhandled in third level state (' + p.type() + ')', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = p.intent()
                .setIntentName('TestIntent')
                .setState('TestState1.TestState2.TestState3');

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('TestState3 Unhandled'));
                done();
            });

            app.handleRequest(request.buildHttpRequest(), response, {
                'HelloWorldIntent': function() {
                    this.tell('HelloWorld');
                },
                'TestIntent': function() {
                    this.tell('Global TestIntent');
                },
                'TestState1': {
                    'TestState2': {
                        'TestState3': {
                            'Unhandled': function() {
                                this.tell('TestState3 Unhandled');
                            },
                        },
                    },
                },
            });
        });
    }
});


