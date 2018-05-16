'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
const expect = require('chai').expect;


// let should = chai.should;
const App = require('../../../lib/app').App;

const RequestBuilderGoogleActionDialogFlow = require('../../../lib/platforms/googleaction/request/util/requestBuilder').RequestBuilder;

const webhookAlexaIntentRequestResponseJSON = '{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":2006,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8664,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":"~socket","connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"content-type":"application/json; charset=utf-8","accept":"application/json","accept-charset":"utf-8","signature":"aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","content-length":"1290","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.x (Java/1.8.0_112)","x-forwarded-proto":"https","x-forwarded-for":"72.21.217.175"},"rawHeaders":["Content-Type","application/json; charset=utf-8","Accept","application/json","Accept-Charset","utf-8","Signature","aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","SignatureCertChainUrl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","Content-Length","1290","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.x (Java/1.8.0_112)","X-Forwarded-Proto","https","X-Forwarded-For","72.21.217.175"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~","body":{"version":"1.0","session":{"new":true,"sessionId":"amzn1.echo-api.session.ce892f42-d6be-4097-a684-6f01f1bf31be","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"AudioPlayer":{"playerActivity":"STOPPED"},"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"LaunchRequest","requestId":"amzn1.echo-api.request.4812a2af-8a96-47fb-9c1d-00b46c85cb12","timestamp":"2017-06-12T15:41:07Z","locale":"en-US"}},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}},"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":"~"},"connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~socket~parser~incoming","locals":{}}';
let response = JSON.parse(webhookAlexaIntentRequestResponseJSON);

const permissionGrantedNameRequestSample = require('../../../lib/platforms/googleaction/request/samples/googleActionDialogflow/v1/permissionGrantedNameRequest');
const permissionGrantedPreciseLocationRequestSample = require('../../../lib/platforms/googleaction/request/samples/googleActionDialogflow/v1/permissionGrantedPreciseLocationRequest');
const permissionGrantedCoarseLocationRequestSample = require('../../../lib/platforms/googleaction/request/samples/googleActionDialogflow/v1/permissionGrantedCoarseLocationRequest');
const permissionGrantedNameAndLocationRequestSample = require('../../../lib/platforms/googleaction/request/samples/googleActionDialogflow/v1/permissionGrantedNameAndLocationRequest');

const permissionNotGrantedRequestSample = require('../../../lib/platforms/googleaction/request/samples/googleActionDialogflow/v1/permissionNotGrantedRequest');


// workaround
response.json = function(json) {};

describe('permission requests', function() {
    it('should return correct name after permission (NAME) granted request', function(done) {
        let app = new App();

        let request = RequestBuilderGoogleActionDialogFlow
            .permissionRequest(permissionGrantedNameRequestSample);

        app.handleRequest(request.buildHttpRequest(), response, {
            'ON_PERMISSION': function() {
                expect(this.googleAction().isPermissionGranted())
                    .to.be.equal(true);
                let requestUser = this.googleAction().getRequest().getUser();

                expect(requestUser.profile.givenName)
                    .to.be.equal('John');
                done();
            },
        });
    });

    it('should return correct location after permission (PRECISE LOCATION) granted request', function(done) {
        let app = new App();

        let request = RequestBuilderGoogleActionDialogFlow
            .permissionRequest(permissionGrantedPreciseLocationRequestSample);

        app.handleRequest(request.buildHttpRequest(), response, {
            'ON_PERMISSION': function() {
                expect(this.googleAction().isPermissionGranted())
                    .to.be.equal(true);
                let device = this.googleAction().getRequest().getDevice();
                expect(device)
                    .to.be.deep.equal( {
                    location: {coordinates: {latitude: 52.2232153, longitude: 13.1158414}},
                });
                done();
            },
        });
    });

    it('should return correct location after permission (COARSE LOCATION) granted request', function(done) {
        let app = new App();

        let request = RequestBuilderGoogleActionDialogFlow
            .permissionRequest(permissionGrantedCoarseLocationRequestSample);

        app.handleRequest(request.buildHttpRequest(), response, {
            'ON_PERMISSION': function() {
                expect(this.googleAction().isPermissionGranted())
                    .to.be.equal(true);
                let device = this.googleAction().getRequest().getDevice();
                expect(device)
                    .to.be.deep.equal( {
                    location: {},
                });
                done();
            },
        });
    });

    it('should return correct name and location after permission (NAME and LOCATION) granted request', function(done) {
        let app = new App();

        let request = RequestBuilderGoogleActionDialogFlow
            .permissionRequest(permissionGrantedNameAndLocationRequestSample);

        app.handleRequest(request.buildHttpRequest(), response, {
            'ON_PERMISSION': function() {
                expect(this.googleAction().isPermissionGranted())
                    .to.be.equal(true);
                let device = this.googleAction().getRequest().getDevice();
                expect(device)
                    .to.be.deep.equal( {
                    location: {coordinates: {latitude: 52.2232153, longitude: 13.1158414}},
                });

                let requestUser = this.googleAction().getRequest().getUser();

                expect(requestUser.profile.givenName)
                    .to.be.equal('John');
                done();
            },
        });
    });

    it('should return granted false after permission not granted request', function(done) {
        let app = new App();

        let request = RequestBuilderGoogleActionDialogFlow
            .permissionRequest(permissionNotGrantedRequestSample);

        app.handleRequest(request.buildHttpRequest(), response, {
            'ON_PERMISSION': function() {
                expect(this.googleAction().isPermissionGranted())
                    .to.be.equal(false);
                done();
            },
        });
    });
});


