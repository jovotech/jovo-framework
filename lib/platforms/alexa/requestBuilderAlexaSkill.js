'use strict';

const webhookAlexaIntentRequestRequestJSON = '{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":1440,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":2,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket~_idleNext","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":"~socket~server","_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket~_idleNext","_timer":{"_list":"~socket~_idleNext~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket","_idleStart":7763,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket~_idleNext","incoming":null,"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true},"_idlePrev":"~socket~_idleNext~_idleNext","_idleStart":7857,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":"~","outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":"~socket","connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~","locals":{}}},"connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"host":"localhost:3000","user-agent":"Apache-HttpClient/UNAVAILABLE (Java/1.8.0_112)","content-length":"680","accept":"application/json","accept-charset":"utf-8","content-type":"application/json; charset=utf-8","signature":"jKutjQExA9Wgnl6KZAN8n+mHafQEyDp4LmbK55NYuKtEfe/LVtXi0MvqsT6f1xbPB+Ms2PGhmQsvPDFIkIqP9D4MDSZKGxyCzSDUiHQy2xPuyNavj3XZ/oByQNVbZLlMNLu5JfApOfV0ynyYK1xl/NYs4tTRqy5YrdY4FgGuxp/LFmTRDxx9zpT7RIbg60TLLfXY+qInRl47tr9cdcI5F4dVYUoBY3I4fO6jBSDOWmk0eK/AH5HwLY1Nf2Oa3icKmStl6stncBP0wg6DF72Wd3tOlI9I61y2PRqZF/r6OJsFHjkvtjuqX15Q3/RWPoHKlwL7QUpSa48GUOKfnDN8FQ==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","x-forwarded-for":"72.21.217.162","x-forwarded-proto":"https","x-original-host":"e890a1d3.ngrok.io"},"rawHeaders":["Host","localhost:3000","User-Agent","Apache-HttpClient/UNAVAILABLE (Java/1.8.0_112)","Content-Length","680","Accept","application/json","Accept-Charset","utf-8","Content-Type","application/json; charset=utf-8","Signature","jKutjQExA9Wgnl6KZAN8n+mHafQEyDp4LmbK55NYuKtEfe/LVtXi0MvqsT6f1xbPB+Ms2PGhmQsvPDFIkIqP9D4MDSZKGxyCzSDUiHQy2xPuyNavj3XZ/oByQNVbZLlMNLu5JfApOfV0ynyYK1xl/NYs4tTRqy5YrdY4FgGuxp/LFmTRDxx9zpT7RIbg60TLLfXY+qInRl47tr9cdcI5F4dVYUoBY3I4fO6jBSDOWmk0eK/AH5HwLY1Nf2Oa3icKmStl6stncBP0wg6DF72Wd3tOlI9I61y2PRqZF/r6OJsFHjkvtjuqX15Q3/RWPoHKlwL7QUpSa48GUOKfnDN8FQ==","Signaturecertchainurl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","X-Forwarded-For","72.21.217.162","X-Forwarded-Proto","https","X-Original-Host","e890a1d3.ngrok.io"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook/voice","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook/voice","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook/voice","path":"/webhook/voice","href":"/webhook/voice","_raw":"/webhook/voice"},"params":{},"query":{},"res":"~socket~_httpMessage","body":{"version":"1.0","session":{"new":true,"sessionId":"SessionId.b4c67d77-b743-4aa7-85d1-5d8d4a78e78d","application":{"applicationId":"amzn1.ask.skill.e49a0ae7-b420-4f6f-a775-1ac1b558005a"},"attributes":{},"user":{"userId":"amzn1.ask.account.AFROOX2SCBHWMDIRBUUAOWJSJGWR5IGMBULQEXTCUUAMZF7BXJYXEE7DSPLRJBPUZIYHSRXIDMQPUNKQ6IFYNLOF66NN2YE2YY7LPMP5Q3AYA5K6RTJRSG474VVG26OHAOKHJWC5TUTKZZKBRQMXKGK52SJ2PNSDO4HSKKOD6P5WEEHTSLINYSJNV45MWO6DEJWUT2KX2FYE5KQ"}},"request":{"type":"IntentRequest","requestId":"EdwRequestId.12bbd508-5a16-4aaf-9b6c-1c9e35009ca8","timestamp":"2017-06-06T13:31:19Z","locale":"en-US","intent":{"name":"NameIntent"}}},"_body":true,"route":{"path":"/webhook/voice","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}}';
const webhookAlexaLaunchRequestRequestJSON = '{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":2006,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":5530,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":"~","outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":"~socket","connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~","locals":{}}},"connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"content-type":"application/json; charset=utf-8","accept":"application/json","accept-charset":"utf-8","signature":"g0gC47Q6rhYhw/+HbLqfuN/9GLrLNBSwLo2/S7xVmw0TzLmXgRDPwFW0sglDIvzfmQyVImxMDAagE0ySgCNCrViiztr/FeNXAYwwcHQXcfV29582cTMnQW7FdKq045fxmtTiVYcKJmN0vI57FUGf7dloKpyfc9mBmdmFMbwFCDfnY00LFa5Q/OpGINzxkbXNxHKVFLrEc73O99WiiuZeh/vRHOSKfhq4PWBymQe9181TqStdUIMhAAooDhw+JYr4S5bMCwPuh7DUXwiWwjPFsB+VxteCyaPrO2r9OHxZhBFKqQB5X/wC+hCLIhxHV5v1N8EcLQVGqkwRQUxwtjZDQA==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","content-length":"1290","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.x (Java/1.8.0_112)","x-forwarded-proto":"https","x-forwarded-for":"72.21.217.110"},"rawHeaders":["Content-Type","application/json; charset=utf-8","Accept","application/json","Accept-Charset","utf-8","Signature","g0gC47Q6rhYhw/+HbLqfuN/9GLrLNBSwLo2/S7xVmw0TzLmXgRDPwFW0sglDIvzfmQyVImxMDAagE0ySgCNCrViiztr/FeNXAYwwcHQXcfV29582cTMnQW7FdKq045fxmtTiVYcKJmN0vI57FUGf7dloKpyfc9mBmdmFMbwFCDfnY00LFa5Q/OpGINzxkbXNxHKVFLrEc73O99WiiuZeh/vRHOSKfhq4PWBymQe9181TqStdUIMhAAooDhw+JYr4S5bMCwPuh7DUXwiWwjPFsB+VxteCyaPrO2r9OHxZhBFKqQB5X/wC+hCLIhxHV5v1N8EcLQVGqkwRQUxwtjZDQA==","SignatureCertChainUrl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","Content-Length","1290","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.x (Java/1.8.0_112)","X-Forwarded-Proto","https","X-Forwarded-For","72.21.217.110"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~socket~_httpMessage","body":{"version":"1.0","session":{"new":true,"sessionId":"amzn1.echo-api.session.25cb0e75-c20a-4347-aeeb-6d05060c5f24","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"AudioPlayer":{"playerActivity":"STOPPED"},"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"LaunchRequest","requestId":"amzn1.echo-api.request.0025dd6d-b967-47d2-aad6-5674fcba988f","timestamp":"2017-06-12T00:35:29Z","locale":"en-US"}},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}}';
const webhookAlexaSessionEndedRequestRequestJSON = '{"version":"1.0","session":{"new":false,"sessionId":"amzn1.echo-api.session.f5b27b35-77df-4e4c-b7b1-f53f56dd5070","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"SessionEndedRequest","requestId":"amzn1.echo-api.request.83e2f58d-1a1d-4978-84ed-b342b7cdd26f","timestamp":"2017-06-12T13:51:32Z","locale":"en-US","reason":"EXCEEDED_MAX_REPROMPTS"}}';

const INTENT_REQUEST = 'IntentRequest';
const LAUNCH_REQUEST = 'LaunchRequest';
const SESSION_ENDED_REQUEST = 'SessionEndedRequest';

/**
 * RequestBuilder builds request objects for various platforms
 */
class RequestBuilderAlexaSkill {

    /**
     * Parses pre fetched launch request object
     * @return {RequestBuilderAlexaSkill}
     */
    launchRequest() {
        this.type = LAUNCH_REQUEST;
        this.req = JSON.parse(webhookAlexaLaunchRequestRequestJSON);
        return this;
    }

    /**
     * Parses pre fetched intent request object
     * @param {string} intentName (optional)
     * @return {RequestBuilderAlexaSkill}
     */
    intentRequest(intentName) {
        this.type = INTENT_REQUEST;
        this.req = JSON.parse(webhookAlexaIntentRequestRequestJSON);
        if (intentName) {
            this.setIntentName(intentName);
        }
        return this;
    }

    /**
     * Parses pre fetche session ended request
     * @return {RequestBuilderAlexaSkill}
     */
    sessionEndedRequest() {
        this.type = SESSION_ENDED_REQUEST;
        this.req = JSON.parse(webhookAlexaSessionEndedRequestRequestJSON);
        return this;
    }

    /**
     * Sets user id
     * @param {string} userId
     * @return {RequestBuilderAlexaSkill}
     */
    setUserId(userId) {
        this.session().user.userId = userId;
        return this;
    }

    /**
     * Sets state (jovo specific)
     * @param {string} stateName
     * @return {RequestBuilderAlexaSkill}
     */
    setState(stateName) {
        this.addSessionAttribute('STATE', stateName);
        return this;
    }

    /**
     * Sets dialog state
     * @param {string} dialogState
     * @return {RequestBuilderAlexaSkill}
     */
    setDialogState(dialogState) {
        this.request().dialogState = dialogState;
        return this;
    }

    /**
     * Adds slot variable + value
     * @param {string} name
     * @param {*} value
     * @return {RequestBuilderAlexaSkill}
     */
    addSlot(name, value) {
        if (this.type !== INTENT_REQUEST) {
            throw Error('Name can only be set for IntentRequests');
        }
        let slotObj = {
            name: name,
            value: value,
        };

        if (!this.request().intent.slots) {
            this.request().intent.slots = {};
        }
        this.request().intent.slots[name] = slotObj;
        return this;
    }

    /**
     * Returns built request object
     * @return {*}
     */
    build() {
        return this.req;
    }

    /**
     * Returns built body request object without http stuff
     * @return {*}
     */
    buildSimple() {
        return this.req.body;
    }

    /**
     * Returns request body
     * @return {*}
     */
    body() {
        return this.req.body;
    }

    /**
     * Request object
     * @return {RequestBuilderAlexaSkill.originalRequest}
     */
    request() {
        return this.req.body.request;
    }

    /**
     * Sets timestamp
     * @param {string} timestamp
     * @return {RequestBuilderAlexaSkill}
     */
    setTimestamp(timestamp) {
        this.request().timestamp = timestamp;
        return this;
    }

    /**
     * Sets user locale
     * @param {string} locale
     * @return {RequestBuilderAlexaSkill}
     */
    setLocale(locale) {
        this.request().locale = locale;
        return this;
    }

    /**
     * Sets request id
     * @param {string} requestId
     */
    setRequestId(requestId) {
        this.request().requestId = requestId;
    }

    /**
     * Sets intent name
     * @param {string} name
     * @return {RequestBuilderAlexaSkill}
     */
    setIntentName(name) {
        if (this.type !== INTENT_REQUEST) {
            throw Error('Name can only be set for IntentRequests');
        }
        this.request().intent.name = name;
        return this;
    }

    /**
     * Returns session object
     * @return {RequestBuilderAlexaSkill.session|*}
     */
    session() {
        return this.req.body.session;
    }

    /**
     * Sets application id
     * @param {string} applicationId
     * @return {RequestBuilderAlexaSkill}
     */
    setApplicationId(applicationId) {
        this.session().application.applicationId = applicationId;
        return this;
    }

    /**
     * Sets session attributes
     * @param {*} attributes
     * @return {RequestBuilderAlexaSkill}
     */
    setSessionAttributes(attributes) {
        if (this.type !== INTENT_REQUEST) {
            throw Error('Name can only be set for IntentRequests');
        }
        this.session().attributes = attributes;
        return this;
    }

    /**
     * Adds session attribute
     * @param {string} name
     * @param {string} value
     * @return {RequestBuilderAlexaSkill}
     */
    addSessionAttribute(name, value) {
        if (this.type !== INTENT_REQUEST) {
            throw Error('Name can only be set for IntentRequests');
        }
        this.session().attributes[name] = value;
        return this;
    }

    /**
     * Returns context object
     * @return {RequestBuilderAlexaSkill.session|*}
     */
    context() {
        return this.req.body.session;
    }
}


module.exports.RequestBuilderAlexaSkill = RequestBuilderAlexaSkill;
