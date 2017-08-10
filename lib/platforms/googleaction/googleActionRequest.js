'use strict';

const STANDARD_LANG_MAP = { // TODO add mapping for other langs
    'en': 'en-US',
};

/**
 * GoogleActionRequest Class
 */
class GoogleActionRequest {
    /**
     * Constructor
     * @param {{}} requestObj
     */
    constructor(requestObj) {
        this.requestObj = requestObj;
    }

    /**
     * Returns unique user id sent by the platforms.
     * @public
     * @return {string} UserId
     */
    getUserId() {
        if (!this.getOriginalRequest()) {
            return 'API.AI Debugging';
        }
        return this.getOriginalRequest().data.user.userId;
    }

    /**
     * Returns original request object.
     * Does not work with API.AI testing.
     * @return {*}
     */
    getOriginalRequest() {
        return this.requestObj.originalRequest;
    }

    /**
     * Returns intent name
     * @return {string}
     */
    getIntentName() {
        return this.requestObj.result.metadata.intentName;
    }

    /**
     * Returns platform's locale
     * @return {String} locale
     */
    getLocale() {
        // user standard lang mapping
        if (STANDARD_LANG_MAP[this.requestObj.lang]) {
            return STANDARD_LANG_MAP[this.requestObj.lang];
        }

        return this.requestObj.lang;
    }

    /**
     * Returns resolved query
     * @return {string}
     */
    getResolvedQuery() {
        return this.requestObj.result.resolvedQuery;
    }

    /**
     * Returns intent parameters
     * @return {*}
     */
    getParameters() {
        return this.requestObj.result.parameters;
    }

    /**
     * Returns contexts
     * @return {*}
     */
    getContexts() {
       return this.requestObj.result.contexts;
    }

    /**
     * Returns contextout object by name
     * @param {string} name
     * @return {*}
     */
    getContextOut(name) {
        for (let i = 0; i < this.requestObj.result.contexts.length; i++) {
            if (this.requestObj.result.contexts[i].name === name) {
                return this.requestObj.result.contexts[i];
            }
        }
        return {};
    }

    /**
     * Returns response object
     * @return {object}
     */
    getRequestObject() {
        return this.requestObj;
    }
}

module.exports.GoogleActionRequest = GoogleActionRequest;
