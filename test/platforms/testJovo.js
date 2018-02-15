'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const expect = require('chai').expect;

chai.use(chaiAsPromised);
chai.should();


// let should = chai.should;
const App = require('../../lib/app').App;
const BaseApp = require('../../lib/app');

const RequestBuilderAlexaSkill = require('../../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;

let RequestBuilderGoogleAction = require('../../lib/platforms/googleaction/requestBuilderGoogleAction').RequestBuilderGoogleAction;
const webhookAlexaIntentRequestResponseJSON = '{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":2006,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8664,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":"~socket","connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"content-type":"application/json; charset=utf-8","accept":"application/json","accept-charset":"utf-8","signature":"aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","content-length":"1290","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.x (Java/1.8.0_112)","x-forwarded-proto":"https","x-forwarded-for":"72.21.217.175"},"rawHeaders":["Content-Type","application/json; charset=utf-8","Accept","application/json","Accept-Charset","utf-8","Signature","aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","SignatureCertChainUrl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","Content-Length","1290","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.x (Java/1.8.0_112)","X-Forwarded-Proto","https","X-Forwarded-For","72.21.217.175"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~","body":{"version":"1.0","session":{"new":true,"sessionId":"amzn1.echo-api.session.ce892f42-d6be-4097-a684-6f01f1bf31be","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"AudioPlayer":{"playerActivity":"STOPPED"},"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"LaunchRequest","requestId":"amzn1.echo-api.request.4812a2af-8a96-47fb-9c1d-00b46c85cb12","timestamp":"2017-06-12T15:41:07Z","locale":"en-US"}},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}},"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":"~"},"connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~socket~parser~incoming","locals":{}}';
let response = JSON.parse(webhookAlexaIntentRequestResponseJSON);

// workaround
response.json = function(json) {};

describe('enableRequestLogging()', function() {
    it('should return true when enabled', function() {
        let app = new App();
        assert(app.config.requestLogging === false, 'false on default');
        app.enableRequestLogging();
        assert(app.config.requestLogging === true, 'true after enabling');
    });
});

describe('enableResponseLogging()', function() {
    it('should return true when enabled', function() {
        let app = new App();
        assert(app.config.responseLogging === false, 'false on default');
        app.enableResponseLogging();
        assert(app.config.responseLogging === true, 'true after enabling');
    });
});
describe('isRequestAllowed()', function() {
    it('should return true if no application ids were set', function() {
        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent')
            .setApplicationId('xyz');
        app.setHandler({
            'HelloWorldIntent': function() {

            },
        });
        app.handleRequest(request.buildHttpRequest(), response);
    });

    it('should return true if correct applications were set', function() {
        let app = new App({
            alexaSkill: {
                allowedApplicationIds: ['abc', 'xyz'],
            },
        });
        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent')
            .setApplicationId('xyz');
        app.setHandler({
            'HelloWorldIntent': function() {
            },
        });
        app.handleRequest(request.buildHttpRequest(), response);
    });

    it('should return false if incorrect applications were set', function() {
        let app = new App({
            alexaSkill: {
                allowedApplicationIds: ['abc'],
            },
        });
        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent')
            .setApplicationId('xyz');
        app.setHandler({
            'HelloWorldIntent': function() {

            },
        });
        assert.throws(
            function() {
                app.handleRequest(request.buildHttpRequest(), response);
            },
            Error,
            'Request application id is not allowed'
        );
    });
});
describe('setIntentMap', function() {
    it('should return empty intentMap', function() {
        let app = new App();
        assert(Object.keys(app.config.intentMap), 'intentMap is empty');
    });

    it('should return defined intentMap', function() {
        let app = new App({
            intentMap: {
                'NameIntent': 'HelloWorldIntent',
            },
        });
        assert(typeof app.config.intentMap !== 'undefined', 'intentMap is not undefined');
        assert(app.config.intentMap['NameIntent'] === 'HelloWorldIntent', 'mapping is correct');
    });
});
describe('setInputMap', function() {
    it('should return defined inputMap', function() {
        let app = new App({
            inputMap: {
                'given-name': 'name',
            },
        });

        assert(typeof app.config.inputMap !== 'undefined', 'inputMap is not undefined');
        assert(app.config.inputMap['given-name'] === 'name', 'mapping is correct');
    });

    it('should return mapped input', function(done) {
        let app = new App({
            inputMap: {
                'firstname': 'name',
            },
        });

        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent')
            .addSlot('firstname', 'foobar');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                assert(this.getInput('name').value === 'foobar', 'mapping is correct');
                done();
            },
        });
    });
});
describe('getIntentName', function() {
    it('should return NameIntent', function(done) {
        let app = new App();

        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('NameIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'NameIntent': function() {
                assert(
                    this.getIntentName() === 'NameIntent',
                    'Wrong intent');
                done();
            },
        });
    });

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
describe('getHandlerPath', function() {
    it('should return "LAUNCH" path', function(done) {
        let app = new App();

        let request = RequestBuilderAlexaSkill
            .launchRequest();

        app.handleRequest(request.buildHttpRequest(), response, {
            'LAUNCH': function() {
                assert(
                    this.getHandlerPath() === 'LAUNCH',
                    'Correct path to LAUNCH');
                done();
            },
        });
    });
    it('should return path to intent', function(done) {
        let app = new App();

        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                assert(
                    this.getHandlerPath() === 'HelloWorldIntent',
                    'Correct path to HelloWorldIntent');
                done();
            },
        });
    });

    it('should return path to intent in state', function(done) {
        let app = new App();

        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setState('Onboarding')
            .setIntentName('HelloWorldIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'Onboarding': {
                'HelloWorldIntent': function() {
                    assert(
                        this.getHandlerPath() === 'Onboarding: HelloWorldIntent',
                        `Correct path to HelloWorldIntent (AlexaSkill): ${this.getHandlerPath()}`);
                    done();
                },
            },
        });
    });
});

describe('followUpState', function() {
    describe('AlexaSkill', function() {
        it('should set the session attribute STATE with the given state', function(done) {
            this.timeout(1000);

            let app = new App();
            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('HelloWorldIntent');

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
            app.on('respond', (jovo) => {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World!'));
                assert.ok(response.hasSessionAttribute('STATE', 'TestState'));
                done();
            });
        });

        it('should go to an intent inside the follow up state', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World'));
                done();
            });


            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('YesIntent')
                .addSessionAttribute('STATE', 'TestState');

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

        it('should go to a global intent when in a state', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Help'));
                done();
            });


            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('HelpIntent')
                .addSessionAttribute('STATE', 'TestState');

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

        it('should go to unhandled intent in a state', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Unhandled'));
                done();
            });


            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('HelpIntent')
                .addSessionAttribute('STATE', 'TestState');

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

        it('should go to unhandled intent globally', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Global-Unhandled'));
                done();
            });


            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('HelpIntent')
                .addSessionAttribute('STATE', 'TestState');

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

        it('should go to unhandled state intent (with a global unhandled intent)', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('State-Unhandled'));
                done();
            });


            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('HelpIntent')
                .addSessionAttribute('STATE', 'TestState');

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
        it('should reset state and jump to intent in the global handler', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World'));
                assert.ok(!response.hasState(null));
                done();
            });


            let request = RequestBuilderAlexaSkill
                .intentRequest()
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
    });

    describe('GoogleAction', function() {
        it('should set the session attribute state with the given state', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let responseObj = jovo.getPlatform().getResponseObject();

                assert(
                    responseObj.data.google.richResponse.items[0].simpleResponse.ssml === '<speak>Hello World!</speak>', // eslint-disable-line
                    'tell');

                let found = false;
                for (let i = 0; i < responseObj.contextOut.length; i++) {
                    if (responseObj.contextOut[i].name === 'session' &&
                        responseObj.contextOut[i].parameters['STATE'] === 'TestState') {
                        found = true;
                    }
                }
                assert(found, 'State found');

                done();
            });

            let request = (new RequestBuilderGoogleAction())
                .intentRequest()
                .setIntentName('HelloWorldIntent')
                .build();

            app.handleRequest(request, response, {
                'HelloWorldIntent': function() {
                    assert.throws(() => {
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

        it('should go to an intent inside the follow up state', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let responseObj = jovo.getPlatform().getResponseObject();
                assert(
                    responseObj.data.google.richResponse.items[0].simpleResponse.ssml === '<speak>Hello World</speak>', // eslint-disable-line
                    'tell');
                done();
            });


            let request = (new RequestBuilderGoogleAction())
                .intentRequest()
                .setIntentName('YesIntent')
                .addContextParameter('session', 'STATE', 'TestState')
                .build();

            app.handleRequest(request, response, {
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
    });
});

describe('toIntent', function() { // TODO works for all platforms?
    it('should skip the intent from the request and call the intent in the arguments', function(done) {
        this.timeout(1000);

        let app = new App();

        app.on('respond', function(jovo) {
            let response = jovo.getPlatform().getResponse();
            assert.ok(response.isTell('Hello John Doe'));
            done();
        });


        let request = RequestBuilderAlexaSkill
            .intentRequest()
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


        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent')
            .addSlot('name', 'John')
            .addSlot('age', 45);

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
                this.tell('Hello ' + name.value + '. You are '+ age.value +' years old.');
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


        let request = RequestBuilderAlexaSkill
            .intentRequest()
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


        let request = RequestBuilderAlexaSkill
            .intentRequest()
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
});

describe('t', function() {
    it('should return Error when trying to get translations and language resource object has not been set', function(done) {
        let app = new App();

        this.timeout(1000);

        app.on('respond', function(jovo) {
            done();
        });

        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('NameIntent')
            .setLocale('en-US');

        app.handleRequest(request.buildHttpRequest(), response, {
            'NameIntent': function() {
                assert.throws(
                    () => {
                        this.t('WELCOME');
                    },
                    Error,
                    'Language resources have not been set for translation.'
                );
                this.tell('i18n test');
            },
        });
    });
    it('should return translation for WELCOME', function(done) {
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
        app.on('respond', function(jovo) {
            done();
        });
        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('NameIntent')
            .setLocale('en-US');
        app.setLanguageResources(languageResources);
        app.handleRequest(request.buildHttpRequest(), response, {
            'NameIntent': function() {
                assert(
                    this.t('WELCOME') === 'Welcome',
                    'Wrong locale3');

                assert(
                    this.t('WELCOME_WITH_PARAMETER', 'Jovo') === 'Welcome Jovo',
                    'Wrong locale4');
                this.tell('i18n test');
            },
        });
    });
    it('should return translation for WELCOME path in de-DE', function(done) {
        let app = new App();
        this.timeout(1000);

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
        app.on('respond', function(jovo) {
            done();
        });
        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('NameIntent')
            .setLocale('de-DE').buildHttpRequest();
        app.setLanguageResources(languageResources);
        app.handleRequest(request, response, {
            'NameIntent': function() {
                assert(
                    this.t('WELCOME') === 'Willkommen',
                    'Wrong locale1');

                assert(
                    this.t('WELCOME_WITH_PARAMETER', 'Jovo') === 'Willkommen Jovo',
                    'Wrong locale2');
                this.tell('i18n test');
            },
        });
    });


    it('should return Error when trying to set an invalid language resource object', function() {
        let app = new App();

        assert.throws(
            () => {
                app.setLanguageResources();
            },
            Error,
            'Invalid language resource.'
        );

        assert.throws(
            function() {
                const invalidLanguageResources = undefined;
                app.setLanguageResources(invalidLanguageResources);
            },
            Error,
            'Invalid language resource.'
        );

        assert.throws(
            function() {
                const invalidLanguageResources = {};
                app.setLanguageResources(invalidLanguageResources);
            },
            Error,
            'Invalid language resource.'
        );
    });
});

describe('toStateIntent', function() { // TODO works for all platforms?
    it('should skip the intent from the request and call the state-intent in the arguments', function(done) {
        this.timeout(1000);

        let app = new App();

        app.on('respond', function(jovo) {
            let response = jovo.getPlatform().getResponse();
            assert.ok(response.isTell('Hello John. You are 45 years old.'));
            done();
        });


        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent')
            .addSlot('name', 'John')
            .addSlot('age', 45);

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function(name, age) {
                assert.throws(
                    () => {
                        this.toStateIntent('TestStateABC', 'OtherIntents', 'John Doe');
                    },
                    Error,
                    'State TestStateABC could not be found in your handler'
                );

                assert.throws(
                    () => {
                        this.toStateIntent('TestState', 'OtherIntents', 'John Doe');
                    },
                    Error,
                    'TestState-OtherIntents could not be found in your handler'
                );
                this.toStateIntent('TestState', 'OtherIntent', name, age);
            },
            'TestState': {
                'OtherIntent': function(name, age) {
                    this.tell('Hello ' + name.value + '. You are '+ age.value +' years old.');
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


        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                assert.throws(
                    () => {
                        this.toStateIntent('TestStateABC', 'OtherIntents', 'John Doe');
                    },
                    Error,
                    'State TestStateABC could not be found in your handler'
                );

                assert.throws(
                    () => {
                        this.toStateIntent('TestState', 'OtherIntents', 'John Doe');
                    },
                    Error,
                    'TestState-OtherIntents could not be found in your handler'
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


        let request = RequestBuilderAlexaSkill
            .intentRequest()
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
});

describe('getSortedArgumentsInput', function() {
    it('should match the slots to arguments', function(done) {
        let app = new App();
        this.timeout(1000);
        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent')
            .addSlot('name', 'John')
            .addSlot('age', 45)
            .addSlot('location', 'New York');
        app.on('respond', function(jovo) {
            done();
        });
        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function(age, name, location) {
                assert(
                    age.value === 45 &&
                    name.value === 'John' &&
                    location.value === 'New York',
                    'Correct arguments matching');
                this.tell('test');
            },
        });
    });
});
describe('Unhandled Intents', function() {
    it('should jump to Unhandled intent when no intent defined', function(done) {
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

    it('should jump to Unhandled intent inside a state when no intent defined', function(done) {
        this.timeout(1000);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest()
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

    it('should throw an error if TestIntent is not defined', function(done) {
        this.timeout(1000);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('TestIntent');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                this.tell('HelloWorld');
            },
        }).catch((error) => {
            assert.ok(error.message === 'The intent name TestIntent has not been defined in your handler.');
            done();
        });
    });

    it('should jump to a global TestIntent if there is no TestIntent in TestState', function(done) {
        this.timeout(1000);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest()
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

    it('should jump to the state Unhandled even if there is a global TestIntent', function(done) {
        this.timeout(1000);

        let app = new App();
        let request = RequestBuilderAlexaSkill
            .intentRequest()
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
});
describe('setConfig(config)', function() {
    it('should return correct default config', function() {
        let app = new App();
        expect(app.config.logging).to.equal(false);
        expect(app.config.requestLogging).to.equal(false);
        expect(app.config.responseLogging).to.equal(false);
        expect(app.config.saveUserOnResponseEnabled).to.equal(true);
        expect(app.config.userDataCol).to.equal('userData');
        expect(app.config.inputMap).to.deep.equal({});
        expect(app.config.intentMap).to.deep.equal({});
        expect(app.config.intentsToSkipUnhandled).to.deep.equal([]);

        expect(app.config.requestLoggingObjects).to.deep.equal([]);
        expect(app.config.responseLoggingObjects).to.deep.equal([]);
        expect(app.config.saveBeforeResponseEnabled).to.equal(false);
        expect(app.config.allowedApplicationIds).to.deep.equal([]);
        expect(app.config.db.localDbFilename).to.equal('db');

        expect(app.config.userMetaData).to.deep.include({
                lastUsedAt: true,
                sessionsCount: true,
                createdAt: true,
                requestHistorySize: 0,
                devices: false,
        });
        expect(app.i18n).to.equal(undefined);
        expect(Object.keys(BaseApp.DEFAULT_CONFIG)).to.have.a.lengthOf(18);
        expect(Object.keys(BaseApp.DEFAULT_CONFIG.userMetaData)).to.have.a.lengthOf(5);
    });

    it('should override default config', function() {
        let app = new App();
        app.setConfig({
            logging: true,
            requestLogging: true,
            responseLogging: true,
            saveUserOnResponseEnabled: false,
            userDataCol: 'otherColumnName',
            inputMap: {
                'given-name': 'name',
            },
            intentMap: {
                'AMAZON.StopIntent': 'StopIntent',
            },
            intentsToSkipUnhandled: ['IntentA', 'IntentB'],
            requestLoggingObjects: ['session'],
            responseLoggingObjects: ['response'],
            saveBeforeResponseEnabled: true,
            allowedApplicationIds: ['id1', 'id2'],
            db: {
                type: 'file',
                localDbFilename: 'otherFilename',
            },
            userMetaData: {
                lastUsedAt: false,
                sessionsCount: false,
                createdAt: false,
                requestHistorySize: 5,
                devices: true,
            },
            i18n: {
                returnObjects: true,
                resources: {
                    'en-US': {
                        translation: {
                            WELCOME: 'Welcome',
                        },
                    },
                    'de-DE': {
                        translation: {
                            WELCOME: 'Willkommen',
                        },
                    },
                },
            },
            analytics: {
                intentsToSkip: [],
                usersToSkip: [],
                intentsToTrack: [],
                services: {
                    VoiceLabsAlexa: {
                        key: 'ACCESS_KEY',
                    },
                    VoiceLabsGoogleAction: {
                        key: 'ACCESS_KEY',
                    },
                },
            },
        });
        expect(app.config.logging).to.equal(true);
        expect(app.config.requestLogging).to.equal(true);
        expect(app.config.responseLogging).to.equal(true);
        expect(app.config.saveUserOnResponseEnabled).to.equal(false);
        expect(app.config.userDataCol).to.equal('otherColumnName');
        expect(app.config.inputMap).to.deep.equal({
            'given-name': 'name',
        });
        expect(app.config.intentMap).to.deep.equal({
            'AMAZON.StopIntent': 'StopIntent',
        });
        expect(app.config.intentsToSkipUnhandled).to.deep.equal(['IntentA', 'IntentB']);

        expect(app.config.requestLoggingObjects).to.deep.equal(['session']);
        expect(app.config.responseLoggingObjects).to.deep.equal(['response']);
        expect(app.config.saveBeforeResponseEnabled).to.equal(true);
        expect(app.config.allowedApplicationIds).to.deep.equal(['id1', 'id2']);
        expect(app.config.db.localDbFilename).to.equal('otherFilename');

        expect(app.config.userMetaData).to.deep.include({
            lastUsedAt: false,
            sessionsCount: false,
            createdAt: false,
            requestHistorySize: 5,
            devices: true,
        });
        expect(app.config.i18n).to.deep.include(
            {
                returnObjects: true,
                resources: {
                    'en-US': {
                        translation: {
                            WELCOME: 'Welcome',
                        },
                    },
                    'de-DE': {
                        translation: {
                            WELCOME: 'Willkommen',
                        },
                    },
                },
            }
        );
        expect(app.config.analytics).to.deep.include(
            {
                intentsToSkip: [],
                usersToSkip: [],
                intentsToTrack: [],
                services: {
                    VoiceLabsAlexa: {
                        key: 'ACCESS_KEY',
                    },
                    VoiceLabsGoogleAction: {
                        key: 'ACCESS_KEY',
                    },
                },
            }
        );
    });
});

