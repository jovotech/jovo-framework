'use strict';
const expect = require('chai').expect;
const assert = require('chai').assert;

const AlexaSkill = require('../../../lib/platforms/alexaSkill/alexaSkill').AlexaSkill;
const Template = require('../../../lib/platforms/alexaSkill/response/renderTemplate/template').Template;
const BodyTemplate1 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/bodyTemplate1').BodyTemplate1;
const BodyTemplate2 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/bodyTemplate2').BodyTemplate2;
const BodyTemplate3 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/bodyTemplate3').BodyTemplate3;
const BodyTemplate6 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/bodyTemplate6').BodyTemplate6;
const ListTemplate1 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/listTemplate1').ListTemplate1;
const ListTemplate2 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/listTemplate2').ListTemplate2;
const ListTemplate3 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/listTemplate3').ListTemplate3;

const RequestBuilderAlexaSkill = require('../../../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;
const App = require('../../../lib/app').App;

const webhookAlexaIntentRequestResponseJSON = '{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":2006,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8664,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":"~socket","connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"content-type":"application/json; charset=utf-8","accept":"application/json","accept-charset":"utf-8","signature":"aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","content-length":"1290","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.x (Java/1.8.0_112)","x-forwarded-proto":"https","x-forwarded-for":"72.21.217.175"},"rawHeaders":["Content-Type","application/json; charset=utf-8","Accept","application/json","Accept-Charset","utf-8","Signature","aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","SignatureCertChainUrl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","Content-Length","1290","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.x (Java/1.8.0_112)","X-Forwarded-Proto","https","X-Forwarded-For","72.21.217.175"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~","body":{"version":"1.0","session":{"new":true,"sessionId":"amzn1.echo-api.session.ce892f42-d6be-4097-a684-6f01f1bf31be","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"AudioPlayer":{"playerActivity":"STOPPED"},"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"LaunchRequest","requestId":"amzn1.echo-api.request.4812a2af-8a96-47fb-9c1d-00b46c85cb12","timestamp":"2017-06-12T15:41:07Z","locale":"en-US"}},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}},"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":"~"},"connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~socket~parser~incoming","locals":{}}';
let response = JSON.parse(webhookAlexaIntentRequestResponseJSON);

// workaround
response.json = function(json) {};


describe('Tests for render templates', function() {
    describe('template(type)', function() {
        it.skip('should return an instance of the specific template', () => {
            expect(AlexaSkill.templateBuilder('BodyTemplate1')).to.be.an.instanceOf(BodyTemplate1);
            expect(AlexaSkill.templateBuilder('BodyTemplate2')).to.be.an.instanceOf(BodyTemplate2);
            expect(AlexaSkill.templateBuilder('BodyTemplate3')).to.be.an.instanceOf(BodyTemplate3);
            expect(AlexaSkill.templateBuilder('BodyTemplate6')).to.be.an.instanceOf(BodyTemplate6);
            expect(AlexaSkill.templateBuilder('ListTemplate1')).to.be.an.instanceOf(ListTemplate1);
            expect(AlexaSkill.templateBuilder('ListTemplate2')).to.be.an.instanceOf(ListTemplate2);
            expect(AlexaSkill.templateBuilder('ListTemplate3')).to.be.an.instanceOf(ListTemplate3);
        });
    });

    describe('Template base class', function() {
       it('should return a valid template base response', () => {
           let template = (new Template())
               .setTitle('Hello World')
               .setToken('tokenXYZ')
               .setBackButton('VISIBLE')
               .setBackgroundImage('https://www.example.com/image.jpg')
               ;
           expect(template.title).to.equal('Hello World');
           expect(template.token).to.equal('tokenXYZ');
           expect(template.backButton).to.equal('VISIBLE');
           expect(template.backgroundImage).to.deep.include({
               sources: [
                   {
                       url: 'https://www.example.com/image.jpg',
                   },
               ],
           });
       });
        it('should throw error on invalid backButton behaviour ', () => {
            let template = (new Template());
            expect(() => {
              template.setBackButton('FooBar');
            }).to.throw('Invalid visibility type');
        });
       it('should make a valid makeRichText object', () => {
           expect(Template.makeRichText('Any Text')).to.deep.include(
               {
                   text: 'Any Text',
                   type: 'RichText',
               });
           expect(Template.makeRichText(
               {
                   text: 'Any Text 2',
                   type: 'RichText',
               }
           )).to.deep.include(
               {
                   text: 'Any Text 2',
                   type: 'RichText',
               });
       });
       it('should make a valid makePlainText object', () => {
            expect(Template.makePlainText('Any Text')).to.deep.include(
                {
                    text: 'Any Text',
                    type: 'PlainText',
                });

           expect(Template.makePlainText(
               {
                   text: 'Any Text 2',
                   type: 'PlainText',
               }
           )).to.deep.include(
               {
                   text: 'Any Text 2',
                   type: 'PlainText',
               });
        });

        it('should make a valid makeTextContent object', () => {
            let textContent1 = Template.makeTextContent('Primary');
            expect(textContent1).to.deep.include(
                {
                    primaryText: {
                        text: 'Primary',
                        type: 'RichText',
                    },
                });

            let textContent2 = Template.makeTextContent('Primary', 'Secondary');
            expect(textContent2).to.deep.include(
                {
                    primaryText: {
                        text: 'Primary',
                        type: 'RichText',
                    },
                    secondaryText: {
                        text: 'Secondary',
                        type: 'RichText',
                    },
                });

            let textContent3 = Template.makeTextContent('Primary', 'Secondary', 'Tertiary');
            expect(textContent3).to.deep.include(
                {
                    primaryText: {
                        text: 'Primary',
                        type: 'RichText',
                    },
                    secondaryText: {
                        text: 'Secondary',
                        type: 'RichText',
                    },
                    tertiaryText: {
                        text: 'Tertiary',
                        type: 'RichText',
                    },
                });
        });
        it('should make a valid image with url as parameter', () => {
            let image = Template.makeImage('https://www.example.com/image.jpg');

            expect(image).to.deep.include(
                {
                    sources: [
                        {
                            url: 'https://www.example.com/image.jpg',
                        },
                    ],
                }
            );
        });
        it('should make a valid image with {url: x, description: y} as parameter', () => {
            let image = Template.makeImage({
                url: 'https://www.example.com/image.jpg',
                description: 'image description',
            });

            expect(image).to.deep.include(
                {
                    contentDescription: 'image description',
                    sources: [
                        {
                            url: 'https://www.example.com/image.jpg',
                        },
                    ],
                }
            );
            // no description
            let image2 = Template.makeImage({
                url: 'https://www.example.com/image.jpg',
            });

            expect(image2).to.deep.include(
                {
                    sources: [
                        {
                            url: 'https://www.example.com/image.jpg',
                        },
                    ],
                }
            );
        });

        it('should make a valid image with image object as parameter', () => {
            let image = Template.makeImage({
                contentDescription: 'image description',
                sources: [
                    {
                        url: 'https://www.example.com/imageSmall.jpg',
                        size: 'X_SMALL',
                        widthPixels: 480,
                        heightPixels: 320,
                    },
                    {
                        url: 'https://www.example.com/imageMedium.jpg',
                        size: 'MEDIUM',
                        widthPixels: 960,
                        heightPixels: 640,
                    },
                ],
            });

            expect(image).to.deep.include(
                {
                    contentDescription: 'image description',
                    sources: [
                        {
                            url: 'https://www.example.com/imageSmall.jpg',
                            size: 'X_SMALL',
                            widthPixels: 480,
                            heightPixels: 320,
                        },
                        {
                            url: 'https://www.example.com/imageMedium.jpg',
                            size: 'MEDIUM',
                            widthPixels: 960,
                            heightPixels: 640,
                        },
                    ],
                }
            );
        });
    });

    describe('BodyTemplate1', function() {
       it('should return a valid BodyTemplate1 response', () => {
           let bodyTemplate1 = new BodyTemplate1()
               .setTextContent('primary', 'secondary');
           expect(bodyTemplate1.type).to.equal('BodyTemplate1');
           expect(bodyTemplate1.textContent).to.deep.include(
               {
                   primaryText: {
                       type: 'RichText',
                       text: 'primary',
                   },
                   secondaryText: {
                       type: 'RichText',
                       text: 'secondary',
                   },
               }
           );
       });
    });

    describe('BodyTemplate2', function() {
        it('should return a valid BodyTemplate2 response', () => {
            let bodyTemplate2 = (new BodyTemplate2())
                .setTextContent('primary', 'secondary')
                .setImage('https://www.example.com/image.jpg')
                ;
            expect(bodyTemplate2.type).to.equal('BodyTemplate2');
            expect(bodyTemplate2.textContent).to.deep.include(
                {
                    primaryText: {
                        type: 'RichText',
                        text: 'primary',
                    },
                    secondaryText: {
                        type: 'RichText',
                        text: 'secondary',
                    },
                }
            );
            expect(bodyTemplate2.image).to.deep.include({
                sources: [
                    {
                        url: 'https://www.example.com/image.jpg',
                    },
                ],
            });

            let bodyTemplate2b = (new BodyTemplate2())
                .setRightImage('https://www.example.com/image2.jpg')
                ;
            expect(bodyTemplate2b.image).to.deep.include({
                sources: [
                    {
                        url: 'https://www.example.com/image2.jpg',
                    },
                ],
            });
        });
    });

    describe('BodyTemplate3', function() {
        it('should return a valid BodyTemplate3 response', () => {
            let bodyTemplate3 = (new BodyTemplate3())
                .setTextContent('primary', 'secondary')
                .setLeftImage('https://www.example.com/image.jpg')
                ;
            expect(bodyTemplate3.type).to.equal('BodyTemplate3');
            expect(bodyTemplate3.textContent).to.deep.include(
                {
                    primaryText: {
                        type: 'RichText',
                        text: 'primary',
                    },
                    secondaryText: {
                        type: 'RichText',
                        text: 'secondary',
                    },
                }
            );
            expect(bodyTemplate3.image).to.deep.include({
                sources: [
                    {
                        url: 'https://www.example.com/image.jpg',
                    },
                ],
            });
        });
    });
    describe('BodyTemplate6', function() {
        it('should return a valid BodyTemplate6 response', () => {
            let bodyTemplate6 = (new BodyTemplate6())
                .setTextContent('primary', 'secondary')
                .setFullScreenImage('https://www.example.com/image.jpg')
                ;
            expect(bodyTemplate6.type).to.equal('BodyTemplate6');
            expect(bodyTemplate6.textContent).to.deep.include(
                {
                    primaryText: {
                        type: 'RichText',
                        text: 'primary',
                    },
                    secondaryText: {
                        type: 'RichText',
                        text: 'secondary',
                    },
                }
            );
            expect(bodyTemplate6.backgroundImage).to.deep.include({
                sources: [
                    {
                        url: 'https://www.example.com/image.jpg',
                    },
                ],
            });
        });
    });
    describe('ListTemplate1', function() {
        it('should return a valid ListTemplate1 response', () => {
            let listTemplate1 = (new ListTemplate1());
            expect(listTemplate1.type).to.equal('ListTemplate1');

            listTemplate1.addItem(
                'item1',
                'https://www.example.com/image.jpg',
                'primary text',
                'secondary text',
                'tertiary text'
            );

            expect(listTemplate1.listItems[0]).to.deep.include(
                {
                    token: 'item1',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text',
                        },
                    },
                }
            );

            // another item

            listTemplate1.addItem(
                'item2',
                'https://www.example.com/image2.jpg',
                'primary text2',
                'secondary text2',
                'tertiary text2'
            );

            expect(listTemplate1.listItems[1]).to.deep.include(
                {
                    token: 'item2',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image2.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text2',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text2',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text2',
                        },
                    },
                }
            );
        });
        it('should set an array of items correctly', () => {
            let listTemplate1 = (new ListTemplate1());
            let items = [
                {
                    token: 'item1',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text',
                        },
                    },
                },
                {
                    token: 'item2',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image2.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text2',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text2',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text2',
                        },
                    },
                },
            ];

            listTemplate1.setItems(items);
            expect(listTemplate1.listItems[0]).to.deep.include(
                {
                    token: 'item1',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text',
                        },
                    },
                }
            );
            expect(listTemplate1.listItems[1]).to.deep.include(
                {
                    token: 'item2',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image2.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text2',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text2',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text2',
                        },
                    },
                }
            );
        });
    });
    describe('ListTemplate2', function() {
        it('should return a valid ListTemplate2 response', () => {
            let listTemplate2 = (new ListTemplate2());
            expect(listTemplate2.type).to.equal('ListTemplate2');
        });
    });
    describe('ListTemplate3', function() {
        it('should return a valid ListTemplate3 response', () => {
            let listTemplate3 = (new ListTemplate3());
            expect(listTemplate3.type).to.equal('ListTemplate3');
        });
    });

    describe('Element Selected Request', function() {
        it('should return Display.ElementSelected handler (via path)', function(done) {
            let app = new App();

            let request = RequestBuilderAlexaSkill
                .displayRequest()
                .setType('Display.ElementSelected')
                .setToken('tokenABC');

            app.handleRequest(request.buildHttpRequest(), response, {
                'ON_ELEMENT_SELECTED': {
                    'tokenABC': function() {
                        done();
                    },
                },
            });
        });
        it('should return Display.ElementSelected handler (via getSelectedElementId())', function(done) {
            let app = new App();

            let request = RequestBuilderAlexaSkill
                .displayRequest()
                .setType('Display.ElementSelected')
                .setToken('tokenABC');

            app.handleRequest(request.buildHttpRequest(), response, {
                'ON_ELEMENT_SELECTED': function() {
                    expect(this.getSelectedElementId())
                        .to.be.equal('tokenABC');
                    done();
                },
            });
        });

        it('should return Display.ElementSelected unhandled handler ', function(done) {
            let app = new App();

            let request = RequestBuilderAlexaSkill
                .displayRequest()
                .setType('Display.ElementSelected')
                .setToken('tokenABC');

            app.handleRequest(request.buildHttpRequest(), response, {
                'ON_ELEMENT_SELECTED': {
                    'token': function() {
                    },
                    'Unhandled': function() {
                        done();
                    },
                },
            });
        });

        it('should return Display.ElementSelected error message if no handler found ', function(done) {
            let app = new App();

            let request = RequestBuilderAlexaSkill
                .displayRequest()
                .setType('Display.ElementSelected')
                .setToken('tokenABC');
            app.handleRequest(request.buildHttpRequest(), response, {
                'ON_ELEMENT_SELECTED': {

                },
            }).catch((error) => {
                assert.ok(error.message === 'Could not find the route "ON_ELEMENT_SELECTED.tokenABC" in your handler function.');
                done();
            });
        });
    });
});

