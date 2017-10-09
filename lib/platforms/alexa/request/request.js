'use strict';

class Request {

    constructor(request) {
        if (request) {
            Object.assign(this, request);
        }
    }

    getVersion() {
        return this.version;
    }

    getType() {
        return this.request.type;
    }

    getRequestId() {
        return this.request.requestId;
    }

    getTimestamp() {
        return this.request.timestamp;
    }

    getLocale() {
        return this.request.locale;
    }

    setVersion(version) {
        this.version = version;
        return this;
    }

    setType(type) {
        this.request.type = type;
        return this;
    }

    setRequestId(requestId) {
        this.request.requestId = requestId;
        return this;
    }

    setTimestamp(timestamp) {
        this.request.timestamp = timestamp;
        return this;
    }

    setLocale(locale) {
        this.request.locale = locale;
        return this;
    }
}

module.exports.Request = Request;
