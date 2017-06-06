let assert = require('chai').assert;

let Jovo = require('../lib/jovo');


let webhookAlexaIntentRequestResponseJSON = '{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":1440,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":6825,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":"~socket","connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"host":"localhost:3000","user-agent":"Apache-HttpClient/UNAVAILABLE (Java/1.8.0_112)","content-length":"680","accept":"application/json","accept-charset":"utf-8","content-type":"application/json; charset=utf-8","signature":"G8IW0TYNcUvYrNfMgv8rMqYdx6/q/aNCIPWrZ6YEm6ihs56vHyV2K7sT4sA/WiKqgR3IT73eNS7NaK/Awi0HKtJehzBVy0+JonXj8AuusruR73yNU4O9kQ9A0S+3p1XuLcbxd36JsREk6ZacJhfJ46JENFPxzD+Gr+c8815NgwSx4uQXlCNL4jbtnySBIHVFzzI0Pg7cFqWgk/mqqJkX2deZDXpk8Fmm384G0G+OQ+J0iaW4SfUjGNXBhoA3TMy/SriuRlE150fakevmlSefP+D9DzbBApLAKREUwNQErlPGEd2UEnc+EBw5EWVIjkCCWFW1AfhrDdDUr/ouIUj3Zg==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","x-forwarded-for":"72.21.217.134","x-forwarded-proto":"https","x-original-host":"e890a1d3.ngrok.io"},"rawHeaders":["Host","localhost:3000","User-Agent","Apache-HttpClient/UNAVAILABLE (Java/1.8.0_112)","Content-Length","680","Accept","application/json","Accept-Charset","utf-8","Content-Type","application/json; charset=utf-8","Signature","G8IW0TYNcUvYrNfMgv8rMqYdx6/q/aNCIPWrZ6YEm6ihs56vHyV2K7sT4sA/WiKqgR3IT73eNS7NaK/Awi0HKtJehzBVy0+JonXj8AuusruR73yNU4O9kQ9A0S+3p1XuLcbxd36JsREk6ZacJhfJ46JENFPxzD+Gr+c8815NgwSx4uQXlCNL4jbtnySBIHVFzzI0Pg7cFqWgk/mqqJkX2deZDXpk8Fmm384G0G+OQ+J0iaW4SfUjGNXBhoA3TMy/SriuRlE150fakevmlSefP+D9DzbBApLAKREUwNQErlPGEd2UEnc+EBw5EWVIjkCCWFW1AfhrDdDUr/ouIUj3Zg==","Signaturecertchainurl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","X-Forwarded-For","72.21.217.134","X-Forwarded-Proto","https","X-Original-Host","e890a1d3.ngrok.io"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook/voice","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook/voice","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook/voice","path":"/webhook/voice","href":"/webhook/voice","_raw":"/webhook/voice"},"params":{},"query":{},"res":"~","body":{"version":"1.0","session":{"new":true,"sessionId":"SessionId.de607763-365e-4416-a32f-ff3e2132bc1a","application":{"applicationId":"amzn1.ask.skill.e49a0ae7-b420-4f6f-a775-1ac1b558005a"},"attributes":{},"user":{"userId":"amzn1.ask.account.AFROOX2SCBHWMDIRBUUAOWJSJGWR5IGMBULQEXTCUUAMZF7BXJYXEE7DSPLRJBPUZIYHSRXIDMQPUNKQ6IFYNLOF66NN2YE2YY7LPMP5Q3AYA5K6RTJRSG474VVG26OHAOKHJWC5TUTKZZKBRQMXKGK52SJ2PNSDO4HSKKOD6P5WEEHTSLINYSJNV45MWO6DEJWUT2KX2FYE5KQ"}},"request":{"type":"IntentRequest","requestId":"EdwRequestId.b2f97535-37a0-4bcc-8924-9412e3b3eb00","timestamp":"2017-06-06T13:25:01Z","locale":"en-US","intent":{"name":"NameIntent","slots":{"name":{"name":"name","value":"Alex"}}}}},"_body":true,"route":{"path":"/webhook/voice","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}},"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":"~"},"connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~socket~parser~incoming","locals":{}}';
let webhookAlexaIntentRequestRequestJSON = '{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":1440,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":2,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket~_idleNext","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":"~socket~server","_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket~_idleNext","_timer":{"_list":"~socket~_idleNext~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket","_idleStart":7763,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket~_idleNext","incoming":null,"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true},"_idlePrev":"~socket~_idleNext~_idleNext","_idleStart":7857,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":"~","outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":"~socket","connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~","locals":{}}},"connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"host":"localhost:3000","user-agent":"Apache-HttpClient/UNAVAILABLE (Java/1.8.0_112)","content-length":"680","accept":"application/json","accept-charset":"utf-8","content-type":"application/json; charset=utf-8","signature":"jKutjQExA9Wgnl6KZAN8n+mHafQEyDp4LmbK55NYuKtEfe/LVtXi0MvqsT6f1xbPB+Ms2PGhmQsvPDFIkIqP9D4MDSZKGxyCzSDUiHQy2xPuyNavj3XZ/oByQNVbZLlMNLu5JfApOfV0ynyYK1xl/NYs4tTRqy5YrdY4FgGuxp/LFmTRDxx9zpT7RIbg60TLLfXY+qInRl47tr9cdcI5F4dVYUoBY3I4fO6jBSDOWmk0eK/AH5HwLY1Nf2Oa3icKmStl6stncBP0wg6DF72Wd3tOlI9I61y2PRqZF/r6OJsFHjkvtjuqX15Q3/RWPoHKlwL7QUpSa48GUOKfnDN8FQ==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","x-forwarded-for":"72.21.217.162","x-forwarded-proto":"https","x-original-host":"e890a1d3.ngrok.io"},"rawHeaders":["Host","localhost:3000","User-Agent","Apache-HttpClient/UNAVAILABLE (Java/1.8.0_112)","Content-Length","680","Accept","application/json","Accept-Charset","utf-8","Content-Type","application/json; charset=utf-8","Signature","jKutjQExA9Wgnl6KZAN8n+mHafQEyDp4LmbK55NYuKtEfe/LVtXi0MvqsT6f1xbPB+Ms2PGhmQsvPDFIkIqP9D4MDSZKGxyCzSDUiHQy2xPuyNavj3XZ/oByQNVbZLlMNLu5JfApOfV0ynyYK1xl/NYs4tTRqy5YrdY4FgGuxp/LFmTRDxx9zpT7RIbg60TLLfXY+qInRl47tr9cdcI5F4dVYUoBY3I4fO6jBSDOWmk0eK/AH5HwLY1Nf2Oa3icKmStl6stncBP0wg6DF72Wd3tOlI9I61y2PRqZF/r6OJsFHjkvtjuqX15Q3/RWPoHKlwL7QUpSa48GUOKfnDN8FQ==","Signaturecertchainurl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","X-Forwarded-For","72.21.217.162","X-Forwarded-Proto","https","X-Original-Host","e890a1d3.ngrok.io"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook/voice","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook/voice","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook/voice","path":"/webhook/voice","href":"/webhook/voice","_raw":"/webhook/voice"},"params":{},"query":{},"res":"~socket~_httpMessage","body":{"version":"1.0","session":{"new":true,"sessionId":"SessionId.b4c67d77-b743-4aa7-85d1-5d8d4a78e78d","application":{"applicationId":"amzn1.ask.skill.e49a0ae7-b420-4f6f-a775-1ac1b558005a"},"attributes":{},"user":{"userId":"amzn1.ask.account.AFROOX2SCBHWMDIRBUUAOWJSJGWR5IGMBULQEXTCUUAMZF7BXJYXEE7DSPLRJBPUZIYHSRXIDMQPUNKQ6IFYNLOF66NN2YE2YY7LPMP5Q3AYA5K6RTJRSG474VVG26OHAOKHJWC5TUTKZZKBRQMXKGK52SJ2PNSDO4HSKKOD6P5WEEHTSLINYSJNV45MWO6DEJWUT2KX2FYE5KQ"}},"request":{"type":"IntentRequest","requestId":"EdwRequestId.12bbd508-5a16-4aaf-9b6c-1c9e35009ca8","timestamp":"2017-06-06T13:31:19Z","locale":"en-US","intent":{"name":"NameIntent","slots":{"name":{"name":"name","value":"Alex"}}}}},"_body":true,"route":{"path":"/webhook/voice","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}}';

describe('Jovo Class - Alexa Webhook tests', function() {
    let app = new Jovo.Jovo();

    let request = JSON.parse(webhookAlexaIntentRequestRequestJSON);
    let response = JSON.parse(webhookAlexaIntentRequestResponseJSON);

    describe('init method', function() {
        app.init(request, response, {
            'HelloWorld': function() {
            },
        });


        it('should return TYPE_WEBHOOK as type', function() {
            assert(
                app.determineType() === Jovo.TYPE_WEBHOOK,
                'Wrong request type');
        });

        it('should return alexa as platform type', function() {
            assert(
                app.getPlatform().getType() === Jovo.PLATFORM_ALEXA,
                'Wrong platform type');
        });

        it('should return INTENT_REQUEST as request type', function() {
            assert(
                app.getPlatform().getRequestType() === Jovo.INTENT_REQUEST,
                'Wrong request type');
        });
    });

    describe('validateHandler(handler)', function() {
        it('should be at least one intent in the handler', function() {
            assert.throws(
                function() {
                    let handlers = {};
                    Jovo.Jovo.validateHandlers(handlers);
                },
                Error,
                'There should be at least one intent in the handler.'
            );
        });

        it('should be the correct type', function() {
            assert.throws(
                function() {
                    let handlers = {
                        'test': 'test',
                    };
                    Jovo.Jovo.validateHandlers(handlers);
                },
                Error,
                'Wrong handler types. Should be object for a state or a function for an intent.'
            );
        });

        it('should be at least one intent in the state', function() {
            assert.throws(
                function() {
                    let handlers = {
                        'state': {},
                    };
                    Jovo.Jovo.validateHandlers(handlers);
                },
                Error,
                'There should be at least one intent in the state.'
            );
        });

        it('should be a function in the state', function() {
            assert.throws(
                function() {
                    let handlers = {
                        'state': {
                            'intent': 'test',
                        },
                    };
                    Jovo.Jovo.validateHandlers(handlers);
                },
                Error,
                'IntentHandler inside of a state should be a function'
            );
        });
    });

    describe('getIntentName', function() {
        app.init(request, response, {
            'HelloWorldIntent': function() {
            },
        });

        it('should return NameIntent', function() {
            assert(
                app.getIntentName() === 'NameIntent',
                'Wrong intent');
        });

        it('should return mapped intent (standard)', function() {
            // TODO: test standard intents (AMAZON.StopIntent)
        });

        it('should return mapped intent (custom)', function() {
            app.setIntentMap({
                'NameIntent': 'HelloWorldIntent',
            });

            assert(
                app.getIntentName() === 'HelloWorldIntent',
                'Wrong intent mapped');
        });
    });
});
