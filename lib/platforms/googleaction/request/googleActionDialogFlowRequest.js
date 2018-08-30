'use strict';

const GoogleActionRequest = require('./googleActionRequest').GoogleActionRequest;
const DialogFlowRequest = require('./dialogFlowRequest').DialogFlowRequest;
const BaseApp = require('./../../../app');
const httpRequestJSON = '{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":1491,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8182,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":"~","outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":"~socket","connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~","locals":{}}},"connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"accept":"*/*","content-type":"application/json; charset=UTF-8","content-length":"1215","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.2 (Java/1.8.0_112)","accept-encoding":"gzip,deflate","x-forwarded-proto":"https","x-forwarded-for":"54.166.230.91"},"rawHeaders":["Accept","*/*","Content-Type","application/json; charset=UTF-8","Content-Length","1215","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.2 (Java/1.8.0_112)","Accept-Encoding","gzip,deflate","X-Forwarded-Proto","https","X-Forwarded-For","54.166.230.91"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~socket~_httpMessage","body":{"originalRequest":{"source":"google","version":"2","data":{"isInSandbox":true,"surface":{"capabilities":[{"name":"actions.capability.AUDIO_OUTPUT"}]},"inputs":[{"rawInputs":[{"query":"give me a space fact","inputType":"VOICE"}],"arguments":[{"rawText":"give me a space fact","textValue":"give me a space fact","name":"text"}],"intent":"actions.intent.TEXT"}],"user":{"locale":"en-US","userId":"APhe68Ec5RA38YUKzHnc1rvN5VV6"},"device":{},"conversation":{"conversationId":"1497363817760","type":"ACTIVE","conversationToken":"[]"}}},"id":"03e14a07-ab13-47f2-81f7-7c36980ca3c4","timestamp":"2017-06-13T14:24:31.032Z","lang":"en","result":{"source":"agent","resolvedQuery":"give me a space fact","speech":"","action":"","actionIncomplete":false,"parameters":{},"contexts":[{"name":"google_assistant_input_type_voice","parameters":{},"lifespan":0},{"name":"actions_capability_audio_output","parameters":{},"lifespan":0}],"metadata":{"intentId":"8230f8bd-ae08-4403-96f5-f3a146614dc3","webhookUsed":"true","webhookForSlotFillingUsed":"false","nluResponseTime":5,"intentName":"GetNewFactIntent"},"fulfillment":{"speech":"","messages":[]},"score":1},"status":{"code":200,"errorType":"success"},"sessionId":"1497363817760"},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}}';

/**
 * Google Action request where Google Actions request is handled via Dialog Flow
 */
class GoogleActionDialogFlowRequest extends DialogFlowRequest {
    /**
     * Constructor
     * @param {*} request object
     */
    constructor(request) {
        super(request);
        if (request) {
            this.originalRequest.data = new GoogleActionRequest(request.originalRequest.data);
        }
    }

    /**
     * Returns google action request
     * @return {GoogleActionRequest}
     */
    getGoogleActionRequest() {
        return this.originalRequest.data;
        // return new GoogleActionRequest(this.originalRequest.data);
    }

    /**
     * Returns original request object
     * @return {*} original request object
     */
    getOriginalRequest() {
        return this.originalRequest;
    }


    /**
     * Jovo implementations ---------------------
     */

    /**
     * Returns user id
     * @return {string}
     */
    getUserId() {
        return this.getGoogleActionRequest().getUserId();
    }

    /**
     * Returns true if user is voice matched
     * @return {string}
     */
    isVoiceUnmatchedUser() {
        return !this.isVoiceMatchedUser();
    }

    /**
     * Returns true if user is not voice matched
     * @return {string}
     */
    isVoiceMatchedUser() {
        return _.isNumber(parseInt(this.getUserId()));
    }

    /**
     * Returns locale
     * @return {String}
     */
    getLocale() {
        return this.getGoogleActionRequest().getLocale();
    }

    /**
     * Returns access token
     * @return {string}
     */
    getAccessToken() {
        return this.getGoogleActionRequest().getAccessToken();
    }

    /**
     * Returns true if session is new
     * @return {boolean}
     */
    isNewSession() {
        return this.getGoogleActionRequest().getConversationType() === 'NEW';
    }

    /**
     * Adds session attribute
     * @param {string} key
     * @param {string} value
     * @return {RequestBuilder}
     */
    setSessionAttribute(key, value) {
        let sessionContext = this.getContext('session');
        if (!sessionContext) {
            this.setContext({
                name: 'session',
                lifespan: 1000,
                parameters: {
                    [key]: value,
                },
            });
        } else {
            sessionContext.parameters[key] = value;
        }
        return this;
    }

    /**
     * Add a whole object of session attributes.
     * @param {object} sessionAttributes
     * @return {RequestBuilder}
     */
    setSessionAttributes(sessionAttributes) {
        for (let sessionAttribute in sessionAttributes) {
            if (sessionAttributes.hasOwnProperty(sessionAttribute)) {
                this.setSessionAttribute(
                    sessionAttribute, sessionAttributes[sessionAttribute]
                );
            }
        }
        return this;
    }

    /**
     * Returns timestamp
     * @return {string}
     */
    getTimestamp() {
        return super.getTimestamp();
    }

    /**
     * Returns raw text
     * @return {string}
     */
    getRawText() {
        return this.getGoogleActionRequest().getRawText();
    }
    /**
     * Sets raw text
     * @param {String} rawText
     * @return {string}
     */
    setRawText(rawText) {
        this.setResolvedQuery(rawText);
        return this;
    }

    /**
     * Gets request type and maps to jovo request types
     * GOOGLE_ASSISTANT_WELCOME => LAUNCH
     * else => INTENT
     * TODO: any ideas how to get end request?
     * @public
     * @return {string}
     */
    getRequestType() {
        if (this.getGoogleActionRequest()
            .isOptionsIntent()) {
            return BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED;
        }
        if (this.getGoogleActionRequest()
            .isSignInIntent()) {
            return BaseApp.REQUEST_TYPE_ENUM.ON_SIGN_IN;
        }

        if (this.getGoogleActionRequest()
            .isPermissionIntent()) {
            return BaseApp.REQUEST_TYPE_ENUM.ON_PERMISSION;
        }
        if (this.getGoogleActionRequest()
            .isMediaStatusIntent()) {
            return BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER;
        }
        if (this.getGoogleActionRequest()
            .isCancelIntent()) {
            return BaseApp.REQUEST_TYPE_ENUM.END;
        }
        // TODO: test with input.welcome
        if (this.getResolvedQuery() === 'GOOGLE_ASSISTANT_WELCOME') {
            return BaseApp.REQUEST_TYPE_ENUM.LAUNCH;
        }
        return BaseApp.REQUEST_TYPE_ENUM.INTENT;
    }

    /**
     * Returns true if device has an audio interface
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.getGoogleActionRequest().hasAudioInterface();
    }

    /**
     * Returns true if device has an screen interface
     * @return {boolean}
     */
    hasScreenInterface() {
        return this.getGoogleActionRequest().hasScreenInterface();
    }

    /**
     * Returns user object from request
     * @return {*}
     */
    getUser() {
        return this.getGoogleActionRequest().getUser();
    }

    /**
     * Returns device object from request
     * @return {*}
     */
    getDevice() {
        return this.getGoogleActionRequest().getDevice();
    }

    /**
     * Sets sessionNew
     * @param {boolean} sessionNew
     * @return {GoogleActionDialogFlowRequest}
     */
    setSessionNew(sessionNew) {
        this.getGoogleActionRequest().setSessionNew(sessionNew);
        return this;
    }

    /**
     * Sets sessionNew
     * @param {String} userId
     * @return {GoogleActionDialogFlowRequest}
     */
    setUserId(userId) {
        this.getGoogleActionRequest().setUserId(userId);
        return this;
    }

    /**
     * Sets access token
     * @param {string} accessToken
     * @return {GoogleActionDialogFlowV2Request}
     */
    setAccessToken(accessToken) {
        this.getGoogleActionRequest().setAccessToken(accessToken);
        return this;
    }

    /**
     * Sets locale
     * @param {String} locale
     * @return {GoogleActionDialogFlowRequest}
     */
    setLocale(locale) {
        this.getGoogleActionRequest().setUserLocale(locale);
        this.setLang(locale.toLowerCase());
        return this;
    }

    /**
     * Sets screen surface
     * @return {GoogleActionDialogFlowV2Request}
     */
    setScreenInterface() {
        this.getGoogleActionRequest().setScreenSurface();
        return this;
    }

    /**
     * Sets audio surface
     * @return {GoogleActionDialogFlowV2Request}
     */
    setAudioInterface() {
        this.getGoogleActionRequest().setAudioSurface();

        // remove screen related context
        for (let i = 0; i < this.getContexts().length; i++) {
            let c = this.getContexts()[i];
            if (c.name === 'actions_capability_screen_output' ||
                c.name === 'google_assistant_input_type_keyboard' ||
                c.name === 'actions_capability_web_browser') {
                this.getContexts().splice(i, 1);
            }
        }

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

    /**
     * NLU data
     */
    // getIntentName
}

module.exports.GoogleActionDialogFlowRequest = GoogleActionDialogFlowRequest;
