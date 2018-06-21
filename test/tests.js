'use strict';
let assert = require('chai').assert;

const RequestBuilderAlexaSkill = require('../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;

const App = require('../lib/app').App;

const util = require('../lib/util');
const webhookAlexaIntentRequestResponseJSON = '{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":2006,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8664,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":"~socket","connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"content-type":"application/json; charset=utf-8","accept":"application/json","accept-charset":"utf-8","signature":"aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","content-length":"1290","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.x (Java/1.8.0_112)","x-forwarded-proto":"https","x-forwarded-for":"72.21.217.175"},"rawHeaders":["Content-Type","application/json; charset=utf-8","Accept","application/json","Accept-Charset","utf-8","Signature","aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","SignatureCertChainUrl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","Content-Length","1290","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.x (Java/1.8.0_112)","X-Forwarded-Proto","https","X-Forwarded-For","72.21.217.175"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~","body":{"version":"1.0","session":{"new":true,"sessionId":"amzn1.echo-api.session.ce892f42-d6be-4097-a684-6f01f1bf31be","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"AudioPlayer":{"playerActivity":"STOPPED"},"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"LaunchRequest","requestId":"amzn1.echo-api.request.4812a2af-8a96-47fb-9c1d-00b46c85cb12","timestamp":"2017-06-12T15:41:07Z","locale":"en-US"}},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}},"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":"~"},"connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~socket~parser~incoming","locals":{}}';
let response = JSON.parse(webhookAlexaIntentRequestResponseJSON);

// workaround
response.json = function(json) {};


describe('Jovo Class - Alexa Webhook tests', function() {
    describe('validateHandler(handler)', function() {
        it('should be at least one intent in the handler', function() {
            assert.throws(
                function() {
                    let handlers = {};
                    util.validateHandlers(handlers);
                },
                Error,
                'There should be at least one intent in the handler.'
            );
        });
    });


    describe('tell', function() {
        describe('AlexaSkill', function() {
            it('should return valid tell with inputs ("name":"John Doe") response', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isTell('Hey John Doe'));
                    done();
                });


                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent')
                    .addSlot('name', 'John Doe');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        this.tell('Hey ' + this.getInput('name').value);
                    },
                });
            });

            it('should return valid tell with a simple card', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isTell('Hello World'));
                    assert.ok(response.hasSimpleCard('Foo', null, 'Bar'));
                    done();
                });


                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        this.showSimpleCard('Foo', 'Bar')
                            .tell('Hello World');
                    },
                });
            });

            it('should return valid tell with an image card (1)', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isTell('Hello World'));
                    assert.ok(response.hasStandardCard('Foo', 'Bar', 'https://any.url.com/image.jpg', 'https://any.url.com/image.jpg'));

                    done();
                });


                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        this.showImageCard('Foo', 'Bar', 'https://any.url.com/image.jpg')
                            .tell('Hello World');
                    },
                });
            });
            it('should return valid tell with an image card (2)', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isTell('Hello World'));
                    assert.ok(response.hasStandardCard('Foo', 'Bar', 'https://any.url.com/image.jpg', 'https://any.url.com/image.jpg'));

                    done();
                });


                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        const imageObject = {
                            smallImageUrl: 'https://any.url.com/image.jpg',
                            largeImageUrl: 'https://any.url.com/image.jpg',
                        };

                        this.showImageCard('Foo', 'Bar', imageObject)
                            .tell('Hello World');
                    },
                });
            });
        });
        describe('GoogleAction', function() {
            for (let rb of util.getPlatformRequestBuilder('GoogleActionDialogFlow', 'GoogleActionDialogFlowV2')) {
                it('should return valid tell with inputs ("name":"John Doe") response', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isTell('Hey John Doe'));
                        done();
                    });


                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent')
                        .addParameter('name', 'John Doe');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            this.tell('Hey ' + this.getInput('name').value);
                        },
                    });
                });

                it('should return valid tell with a simple card', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isTell('Hello World'));
                        assert.ok(response.hasBasicCard('Foo', 'Bar'));
                        done();
                    });


                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            this.showSimpleCard('Foo', 'Bar')
                                .tell('Hello World');
                        },
                    });
                });

                it('should return valid tell with an image card (1)', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isTell('Hello World'));
                        assert.ok(response.hasImageCard('Foo', 'Bar', 'https://any.url.com/image.jpg', 'Foo'));
                        done();
                    });


                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            this.showImageCard('Foo', 'Bar', 'https://any.url.com/image.jpg')
                                .tell('Hello World');
                        },
                    });
                });
                it('should return valid tell with an image card (2)', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isTell('Hello World'));
                        assert.ok(response.hasImageCard('Foo', 'Bar', 'https://any.url.com/image.jpg', 'Foo'));
                        done();
                    });


                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            const imageObject = {
                                smallImageUrl: 'https://any.url.com/image.jpg',
                                largeImageUrl: 'https://any.url.com/image.jpg',
                            };

                            this.showImageCard('Foo', 'Bar', imageObject)
                                .tell('Hello World');
                        },
                    });
                });
            }
        });
    });

    describe('ask', function() {
        describe('AlexaSkill', function() {
            it('should return valid simple ask ("What is your name?","Your name please") response', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isAsk('What is your name?', 'Your name please'));
                    done();
                });

                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        this.ask('What is your name?', 'Your name please');
                    },
                });
            });

            it('should return valid ask with a simple card', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isAsk('What is your name?', 'Your name please'));
                    assert.ok(response.hasSimpleCard('Foo', null, 'Bar'));

                    done();
                });


                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        this.showSimpleCard('Foo', 'Bar')
                            .ask('What is your name?', 'Your name please');
                    },
                });
            });

            it('should return valid ask with an image card (1)', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();

                    assert.ok(response.isAsk('What is your name?', 'Your name please'));
                    assert.ok(response.hasStandardCard('Foo', 'Bar', 'https://any.url.com/image.jpg', 'https://any.url.com/image.jpg'));

                    done();
                });


                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        this.showImageCard('Foo', 'Bar', 'https://any.url.com/image.jpg')
                            .ask('What is your name?', 'Your name please');
                    },
                });
            });
            it('should return valid ask with an image card (2)', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();

                    assert.ok(response.isAsk('What is your name?', 'Your name please'));
                    assert.ok(response.hasStandardCard('Foo', 'Bar', 'https://any.url.com/image.jpg', 'https://any.url.com/image.jpg'));

                    done();
                });


                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        const imageObject = {
                            smallImageUrl: 'https://any.url.com/image.jpg',
                            largeImageUrl: 'https://any.url.com/image.jpg',
                        };

                        this.showImageCard('Foo', 'Bar', imageObject)
                            .ask('What is your name?', 'Your name please');
                    },
                });
            });
        });

        describe('GoogleAction', function() {
            for (let rb of util.getPlatformRequestBuilder('GoogleActionDialogFlow', 'GoogleActionDialogFlowV2')) {
                it('should return valid simple ask ("What is your name?","Your name please") response', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isAsk('What is your name?', 'Your name please'));
                        done();
                    });

                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            this.ask('What is your name?', 'Your name please');
                        },
                    });
                });

                it('should return valid ask with a simple card', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isAsk('What is your name?', 'Your name please'));
                        assert.ok(response.hasBasicCard('Foo', 'Bar'));
                        done();
                    });

                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            this.showSimpleCard('Foo', 'Bar')
                                .ask('What is your name?', 'Your name please');
                        },
                    });
                });

                it('should return valid ask with an image card (1)', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isAsk('What is your name?', 'Your name please'));
                        assert.ok(response.hasBasicCard('Foo', 'Bar', 'https://any.url.com/image.jpg', 'Foo'));
                        done();
                    });

                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            this.showImageCard('Foo', 'Bar', 'https://any.url.com/image.jpg')
                                .ask('What is your name?', 'Your name please');
                        },
                    });
                });
                it('should return valid ask with an image card (2)', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isAsk('What is your name?', 'Your name please'));
                        assert.ok(response.hasBasicCard('Foo', 'Bar', 'https://any.url.com/image.jpg', 'Foo'));
                        done();
                    });

                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            const imageObject = {
                                smallImageUrl: 'https://any.url.com/image.jpg',
                                largeImageUrl: 'https://any.url.com/image.jpg',
                            };

                            this.showImageCard('Foo', 'Bar', imageObject)
                                .ask('What is your name?', 'Your name please');
                        },
                    });
                });
            }
        });
    });


    describe('play', function() {
        describe('AlexaSkill', function() {
            it('should return simple play response', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isPlay('https://any.url.com/file.mp3'));
                    done();
                });

                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        this.play('https://any.url.com/file.mp3');
                    },
                });
            });
        });

        describe('GoogleAction', function() {
            for (let rb of util.getPlatformRequestBuilder('GoogleActionDialogFlow', 'GoogleActionDialogFlowV2')) {
                it('should return simple play response', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isPlay('https://any.url.com/file.mp3', 'FallbackText'));
                        done();
                    });

                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            this.play('https://any.url.com/file.mp3', 'FallbackText');
                        },
                    });
                });
            }
        });
    });

    describe('Session attributes', function() {
        describe('AlexaSkill', function() {
            it('should set the name session attribute and update the age ', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isTell('Hello World!'));
                    assert.ok(response.hasSessionAttribute('name', 'John Doe'));
                    assert.ok(response.hasSessionAttribute('age', 40));
                    done();
                });


                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('HelloWorldIntent')
                    .addSessionAttribute('age', 50);

                app.handleRequest(request.buildHttpRequest(), response, {
                    'HelloWorldIntent': function() {
                        this.addSessionAttribute('age', 40);
                        this.addSessionAttribute('name', 'John Doe').tell('Hello World!');
                    },
                });
            });

            it('should get the session attribute ', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isTell('Hello undefined'));
                    done();
                });


                let request = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName('AnotherIntent')
                    .addSessionAttribute('name', 'John Doe');

                app.handleRequest(request.buildHttpRequest(), response, {
                    'AnotherIntent': function() {
                        this.tell('Hello ' + this.getSessionAttribute('firstname'));
                    },
                });
            });
        });

        describe('GoogleAction', function() {
            for (let rb of util.getPlatformRequestBuilder('GoogleActionDialogFlow', 'GoogleActionDialogFlowV2')) {
                it('should set the name session attribute and update the age session attribute', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.hasContextOutParameter('session', 'name', 'John Doe'));
                        assert.ok(response.hasContextOutParameter('session', 'age', 40));
                        done();
                    });


                    let request = rb.intentRequest()
                        .setIntentName('HelloWorldIntent')
                        .setSessionAttribute('age', 50);

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'HelloWorldIntent': function() {
                            this.addSessionAttribute('age', 40);
                            this.addSessionAttribute('name', 'John Doe').tell('Hello World!');
                        },
                    });
                });

                it('should get the session attribute ', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isTell('Hello undefined'));

                        done();
                    });


                    let request = rb.intentRequest()
                        .setIntentName('AnotherIntent')
                        .setSessionAttribute('name', 'John Doe');

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'AnotherIntent': function() {
                            this.tell('Hello ' + this.getSessionAttribute('firstname'));
                        },
                    });
                });
            }
        });
    });


    describe('LaunchRequest', function() {
        describe('AlexaSkill', function() {
            it('should call LAUNCH ', function(done) {
                this.timeout(1000);

                let app = new App();

                app.on('respond', function(jovo) {
                    let response = jovo.getPlatform().getResponse();
                    assert.ok(response.isTell('Hello World!'));
                    done();
                });

                let request = RequestBuilderAlexaSkill
                    .launchRequest();

                app.handleRequest(request.buildHttpRequest(), response, {
                    'LAUNCH': function() {
                        this.tell('Hello World!');
                    },
                });
            });
        });

        describe('GoogleAction', function() {
            for (let rb of util.getPlatformRequestBuilder('GoogleActionDialogFlow', 'GoogleActionDialogFlowV2')) {
                it('should call LAUNCH ', function(done) {
                    this.timeout(1000);

                    let app = new App();

                    app.on('respond', function(jovo) {
                        let response = jovo.getPlatform().getResponse();
                        assert.ok(response.isTell('Hello World!'));
                        done();
                    });

                    let request = rb.launchRequest();

                    app.handleRequest(request.buildHttpRequest(), response, {
                        'LAUNCH': function() {
                            this.tell('Hello World!');
                        },
                    });
                });
            }
        });
    });

    describe('EndRequest', function() { // TODO Nothing for GoogleAction?
        it('should call END from Amazon.StopIntent ', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isTell('Hello World!'));
                done();
            });


            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('AMAZON.StopIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'END': function() {
                    this.tell('Hello World!');
                },
            });
        });
        it('should call END - empty response if no END defined ', function(done) {
            this.timeout(1000);

            let app = new App();

            app.on('respond', function(jovo) {
                let response = jovo.getPlatform().getResponse();
                assert.ok(response.isEmptyResponse());
                done();
            });


            let request = RequestBuilderAlexaSkill
                .intentRequest()
                .setIntentName('AMAZON.StopIntent');

            app.handleRequest(request.buildHttpRequest(), response, {
                'LAUNCH': function() {
                    // Do nothing
                },
            });
        });
    });
});

