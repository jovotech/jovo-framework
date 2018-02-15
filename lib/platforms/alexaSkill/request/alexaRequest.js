'use strict';
const httpRequestJSON = '{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":1440,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":2,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket~_idleNext","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":"~socket~server","_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket~_idleNext","_timer":{"_list":"~socket~_idleNext~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket","_idleStart":7763,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket~_idleNext","incoming":null,"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true},"_idlePrev":"~socket~_idleNext~_idleNext","_idleStart":7857,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":"~","outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":"~socket","connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~","locals":{}}},"connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"host":"localhost:3000","user-agent":"Apache-HttpClient/UNAVAILABLE (Java/1.8.0_112)","content-length":"680","accept":"application/json","accept-charset":"utf-8","content-type":"application/json; charset=utf-8","signature":"jKutjQExA9Wgnl6KZAN8n+mHafQEyDp4LmbK55NYuKtEfe/LVtXi0MvqsT6f1xbPB+Ms2PGhmQsvPDFIkIqP9D4MDSZKGxyCzSDUiHQy2xPuyNavj3XZ/oByQNVbZLlMNLu5JfApOfV0ynyYK1xl/NYs4tTRqy5YrdY4FgGuxp/LFmTRDxx9zpT7RIbg60TLLfXY+qInRl47tr9cdcI5F4dVYUoBY3I4fO6jBSDOWmk0eK/AH5HwLY1Nf2Oa3icKmStl6stncBP0wg6DF72Wd3tOlI9I61y2PRqZF/r6OJsFHjkvtjuqX15Q3/RWPoHKlwL7QUpSa48GUOKfnDN8FQ==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","x-forwarded-for":"72.21.217.162","x-forwarded-proto":"https","x-original-host":"e890a1d3.ngrok.io"},"rawHeaders":["Host","localhost:3000","User-Agent","Apache-HttpClient/UNAVAILABLE (Java/1.8.0_112)","Content-Length","680","Accept","application/json","Accept-Charset","utf-8","Content-Type","application/json; charset=utf-8","Signature","jKutjQExA9Wgnl6KZAN8n+mHafQEyDp4LmbK55NYuKtEfe/LVtXi0MvqsT6f1xbPB+Ms2PGhmQsvPDFIkIqP9D4MDSZKGxyCzSDUiHQy2xPuyNavj3XZ/oByQNVbZLlMNLu5JfApOfV0ynyYK1xl/NYs4tTRqy5YrdY4FgGuxp/LFmTRDxx9zpT7RIbg60TLLfXY+qInRl47tr9cdcI5F4dVYUoBY3I4fO6jBSDOWmk0eK/AH5HwLY1Nf2Oa3icKmStl6stncBP0wg6DF72Wd3tOlI9I61y2PRqZF/r6OJsFHjkvtjuqX15Q3/RWPoHKlwL7QUpSa48GUOKfnDN8FQ==","Signaturecertchainurl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","X-Forwarded-For","72.21.217.162","X-Forwarded-Proto","https","X-Original-Host","e890a1d3.ngrok.io"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook/voice","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook/voice","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook/voice","path":"/webhook/voice","href":"/webhook/voice","_raw":"/webhook/voice"},"params":{},"query":{},"res":"~socket~_httpMessage","body":{},"_body":true,"route":{"path":"/webhook/voice","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}}';


/**
 * Base class of a request from alexa
 */
class AlexaRequest {

    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        if (request) {
            Object.assign(this, request);
        }
    }

    /**
     * Returns version of the api
     * @return {string} version number
     */
    getVersion() {
        return this.version;
    }

    /**
     * Returns type of request.
     * Possible types.
     * LaunchRequest, IntentRequest, SessionEndedRequest
     * AudioPlayer.*
     * Display.*
     * System.ExceptionEncountered
     * @return {string} type of request
     */
    getType() {
        return this.request.type;
    }

    /**
     * Returns id of request
     * @return {string}
     */
    getRequestId() {
        return this.request.requestId;
    }

    /**
     * Returns platform's timestamp
     * @return {String} timestamp
     */
    getTimestamp() {
        return this.request.timestamp;
    }

    /**
     * Returns platform's locale
     * @return {String} locale
     */
    getLocale() {
        return this.request.locale;
    }

    /**
     * Sets version of the request
     * @param {string} version
     * @return {AlexaRequest}
     */
    setVersion(version) {
        this.version = version;
        return this;
    }

    /**
     * Sets type of the request
     * Possible types.
     * LaunchRequest, IntentRequest, SessionEndedRequest
     * AudioPlayer.*
     * Display.*
     * System.ExceptionEncountered
     * @param {string} type
     * @return {AlexaRequest}
     */
    setType(type) {
        this.request.type = type;
        return this;
    }

    /**
     * Sets id of the request
     * @param {string} requestId
     * @return {AlexaRequest}
     */
    setRequestId(requestId) {
        this.request.requestId = requestId;
        return this;
    }

    /**
     * Sets timestamp of the request
     * @param {string} timestamp
     * @return {AlexaRequest}
     */
    setTimestamp(timestamp) {
        this.request.timestamp = timestamp;
        return this;
    }

    /**
     * Sets user's locale of the request
     * @param {string} locale
     * @return {AlexaRequest}
     */
    setLocale(locale) {
        this.request.locale = locale;
        return this;
    }

    /**
     * Builds full http request from request object.
     * @return {*} request
     */
    buildHttpRequest() {
        let req = JSON.parse(httpRequestJSON);
        req.body = this;
        return req;
    }
}

module.exports.AlexaRequest = AlexaRequest;
