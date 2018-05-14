'use strict';

const Plugin = require('../plugin').Plugin;
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

/**
 * Basic Logging
 */
class BasicLogging extends Plugin {

    /**
     * Constructor for class BasicLogging
     * @param {object|string} options
     * @param {string} recordingName
     */
    constructor(options, recordingName) {
        if (typeof options === 'boolean' && options === true) {
            super();
            if (recordingName !== 'true') {
                this.recordingName = recordingName;
            }
            this.alexaIndex = 0;
            this.googleActionIndex = 0;
            this.index = 0;
            this.record = true;
        } else {
            super(options);
            this.record = false;
        }
    }

    /**
     * Initializes listeners
     */
    init() {
        this.app.on('request', (jovo) => {
            if (this.options.requestLogging) {
                if (this.options.requestLoggingObjects &&
                    this.options.requestLoggingObjects.length > 0) {
                    this.options.requestLoggingObjects.forEach((path) => {
                        console.log(JSON.stringify(_.get(jovo.requestObj, path), null, '\t'));
                    });
                } else {
                    console.log(JSON.stringify(jovo.requestObj, null, '\t'));
                }
                if (this.record) {
                    let requestObj = jovo.requestObj;

                    // check wether request is alexa or google action based
                    if (requestObj.originalRequest && requestObj.originalRequest.source === 'google') {
                        this.googleActionIndex += 1;
                        this.index = this.googleActionIndex;
                        this.sessionId = requestObj.sessionId;
                        this.intentName = requestObj.result.metadata.intentName;
                        this.type = 'google-action';
                    } else {
                        this.sessionId = requestObj.session.sessionId;
                        this.alexaIndex += 1;
                        this.index = this.alexaIndex;
                        if (requestObj.request.intent && requestObj.request.intent.name) {
                            this.intentName = requestObj.request.intent.name;
                        } else {
                            this.intentName = requestObj.request.type;
                        }
                        this.type = 'alexa';
                    }

                    let sessionPath = `.${path.sep}test${path.sep}helper${path.sep}` +
                        `record_${this.recordingName ? this.recordingName : this.sessionId}` +
                        `${path.sep}${this.type}${path.sep}`;

                    if (!fs.existsSync(sessionPath)) {
                        shell.mkdir('-p', sessionPath);
                    }

                    let requestsPath = `${sessionPath}${this.index}_req_${this.intentName}.json`;
                    fs.writeFileSync(requestsPath, JSON.stringify(requestObj, null, 4));
                }
            }
        });

        this.app.on('response', (jovo) => {
            // log response object
            if (this.options.responseLogging) {
                if (this.options.responseLoggingObjects &&
                    this.options.responseLoggingObjects.length > 0) {
                    this.options.responseLoggingObjects.forEach((path) => {
                        console.log(JSON.stringify(_.get(jovo.getPlatform().getResponseObject(), path), null, '\t'));
                    });
                } else {
                    console.log(JSON.stringify(jovo.getPlatform().getResponseObject(), null, '\t'));
                }

                if (this.record) {
                    let responseObj = jovo.getPlatform().getResponseObject();

                    let sessionPath = `.${path.sep}test${path.sep}helper${path.sep}` +
                        `record_${this.recordingName ? this.recordingName : this.sessionId}` +
                        `${path.sep}${this.type}${path.sep}`;

                    let responsesPath = `${sessionPath}${this.index}_res_${this.intentName}.json`;
                    fs.writeFileSync(responsesPath, JSON.stringify(responseObj, null, 4));
                }
            }
        });
    }
}

module.exports.BasicLogging = BasicLogging;
