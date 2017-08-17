'use strict';

const webhookGoogleActionLaunch = '{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":1452,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":21059,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":"~","outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":"~socket","connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~","locals":{}}},"connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"accept":"*/*","content-type":"application/json; charset=UTF-8","content-length":"1176","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.2 (Java/1.8.0_112)","accept-encoding":"gzip,deflate","x-forwarded-proto":"https","x-forwarded-for":"54.166.230.91"},"rawHeaders":["Accept","*/*","Content-Type","application/json; charset=UTF-8","Content-Length","1176","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.2 (Java/1.8.0_112)","Accept-Encoding","gzip,deflate","X-Forwarded-Proto","https","X-Forwarded-For","54.166.230.91"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~socket~_httpMessage","body":{"originalRequest":{"source":"google","version":"2","data":{"isInSandbox":true,"surface":{"capabilities":[{"name":"actions.capability.AUDIO_OUTPUT"}]},"inputs":[{"rawInputs":[{"query":"talk to my test app","inputType":"VOICE"}],"intent":"actions.intent.MAIN"}],"user":{"locale":"en-US","userId":"APhe68Ec5RA38YUKzHnc1rvN5VV6"},"device":{},"conversation":{"conversationId":"1497363817760","type":"NEW"}}},"id":"0ffc961f-2256-4494-96d5-f294d96b5900","timestamp":"2017-06-13T14:23:37.851Z","lang":"en","result":{"source":"agent","resolvedQuery":"GOOGLE_ASSISTANT_WELCOME","speech":"","action":"input.welcome","actionIncomplete":false,"parameters":{},"contexts":[{"name":"google_assistant_welcome","parameters":{},"lifespan":0},{"name":"actions_capability_audio_output","parameters":{},"lifespan":0},{"name":"google_assistant_input_type_voice","parameters":{},"lifespan":0}],"metadata":{"intentId":"340561df-dfad-4575-b11c-0eeb0a5acf36","webhookUsed":"true","webhookForSlotFillingUsed":"false","nluResponseTime":2,"intentName":"Default Welcome Intent"},"fulfillment":{"speech":"","messages":[]},"score":1},"status":{"code":200,"errorType":"success"},"sessionId":"1497363817760"},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}}';
const webhookGoogleActionIntentRequest = '{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":1491,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8182,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":"~","outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":"~socket","connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~","locals":{}}},"connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"accept":"*/*","content-type":"application/json; charset=UTF-8","content-length":"1215","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.2 (Java/1.8.0_112)","accept-encoding":"gzip,deflate","x-forwarded-proto":"https","x-forwarded-for":"54.166.230.91"},"rawHeaders":["Accept","*/*","Content-Type","application/json; charset=UTF-8","Content-Length","1215","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.2 (Java/1.8.0_112)","Accept-Encoding","gzip,deflate","X-Forwarded-Proto","https","X-Forwarded-For","54.166.230.91"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~socket~_httpMessage","body":{"originalRequest":{"source":"google","version":"2","data":{"isInSandbox":true,"surface":{"capabilities":[{"name":"actions.capability.AUDIO_OUTPUT"}]},"inputs":[{"rawInputs":[{"query":"give me a space fact","inputType":"VOICE"}],"arguments":[{"rawText":"give me a space fact","textValue":"give me a space fact","name":"text"}],"intent":"actions.intent.TEXT"}],"user":{"locale":"en-US","userId":"APhe68Ec5RA38YUKzHnc1rvN5VV6"},"device":{},"conversation":{"conversationId":"1497363817760","type":"ACTIVE","conversationToken":"[]"}}},"id":"03e14a07-ab13-47f2-81f7-7c36980ca3c4","timestamp":"2017-06-13T14:24:31.032Z","lang":"en","result":{"source":"agent","resolvedQuery":"give me a space fact","speech":"","action":"","actionIncomplete":false,"parameters":{},"contexts":[{"name":"google_assistant_input_type_voice","parameters":{},"lifespan":0},{"name":"actions_capability_audio_output","parameters":{},"lifespan":0}],"metadata":{"intentId":"8230f8bd-ae08-4403-96f5-f3a146614dc3","webhookUsed":"true","webhookForSlotFillingUsed":"false","nluResponseTime":5,"intentName":"GetNewFactIntent"},"fulfillment":{"speech":"","messages":[]},"score":1},"status":{"code":200,"errorType":"success"},"sessionId":"1497363817760"},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}}';

const INTENT_REQUEST = 'IntentRequest';
const LAUNCH_REQUEST = 'LaunchRequest';

/**
 * RequestBuilder builds request objects for various platforms
 */
class RequestBuilderGoogleAction {

    /**
     * Parses pre fetched launch request object
     * @return {RequestBuilderGoogleAction}
     */
    launchRequest() {
        this.type = LAUNCH_REQUEST;
        this.req = JSON.parse(webhookGoogleActionLaunch);
        return this;
    }
    /**
     * Parses pre fetched intent request object
     * @param {string} intentName (optional)
     * @return {RequestBuilderGoogleAction}
     */
    intentRequest(intentName) {
        this.type = INTENT_REQUEST;
        this.req = JSON.parse(webhookGoogleActionIntentRequest);
        if (intentName) {
            this.setIntentName(intentName);
        }
        return this;
    }

    /**
     * Sets user id
     * @param {string} userId
     * @return {RequestBuilderGoogleAction}
     */
    setUserId(userId) {
        this.originalRequest().data.user.userId = userId;
        return this;
    }

    /**
     * Sets timestamp
     * @param {string} timestamp
     * @return {RequestBuilderGoogleAction}
     */
    setTimestamp(timestamp) {
        this.req.body.timestamp = timestamp;
        return this;
    }

    /**
     * Sets user locale
     * @param {string} locale
     * @return {RequestBuilderGoogleAction}
     */
    setUserLocale(locale) {
        this.originalRequest().data.user.locale = locale;
        return this;
    }

    /**
     * Sets state (jovo specific)
     * @param {string} stateName
     * @return {RequestBuilderGoogleAction}
     */
    setState(stateName) {
        this.addContextParameter('session', 'STATE', stateName);
        return this;
    }

    /**
     * Sets intent name
     * @param {string} name
     * @return {RequestBuilderGoogleAction}
     */
    setIntentName(name) {
        if (this.type !== INTENT_REQUEST) {
            throw Error('Name can only be set for IntentRequests');
        }
        this.result().metadata.intentName = name;
        return this;
    }

    /**
     * Sets parameter
     * @param {string} name
     * @param {*} value
     * @return {RequestBuilderGoogleAction}
     */
    addParameter(name, value) {
        this.result().parameters[name] = value;
        return this;
    }

    /**
     * Adds parameter to context
     * @param {string} contextName
     * @param {string} parameterName
     * @param {*} value
     * @return {RequestBuilderGoogleAction}
     */
    addContextParameter(contextName, parameterName, value) {
        let existingSessionContext = false;
        for (let i = 0; i < this.result().contexts.length; i++) {
            // find session context
            if (this.result().contexts[i].name === contextName) {
                this.result().contexts[i].parameters[parameterName] = value;
                existingSessionContext = true;
            }
        }

        if (existingSessionContext === false) {
            let sessionContext = {};
            sessionContext['name'] = contextName;
            sessionContext['lifespan'] = 10000; // TODO: check max
            sessionContext['parameters'] = {};
            sessionContext['parameters'][parameterName] = value;
            this.result().contexts.push(
                sessionContext
            );
        }
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
     * Returns request body
     * @return {*}
     */
    body() {
        return this.req.body;
    }

    /**
     * Original request
     * @return {RequestBuilderGoogleAction.originalRequest}
     */
    originalRequest() {
        return this.req.body.originalRequest;
    }

    /**
     * Returns result object
     * @return {RequestBuilderGoogleAction.result|Object|_.result|*}
     */
    result() {
        return this.req.body.result;
    }
}


module.exports.RequestBuilderGoogleAction = RequestBuilderGoogleAction;
