'use strict';

const Plugin = require('../plugin').Plugin;
const _ = require('lodash');
const fs = require('fs');

let helperPath = './test/helper/';
let sessionId = '';

/**
 * Basic Logging
 */
class BasicLogging extends Plugin {
    /**
     * Constructor
     * @param {*} options
     */
    constructor(options) {
        if (typeof options === 'boolean') {
            super();
            this.record = options;
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
                        console.log('----------------------------------------------------------------------------------------');
                        console.log(JSON.stringify(_.get(jovo.requestObj, path), null, '\t'));
                    });
                } else {
                    console.log('----------------------------------------------------------------------------------------');
                    console.log(JSON.stringify(jovo.requestObj, null, '\t'));
                }
                if (this.record) {
                    let requestObj = jovo.requestObj;
                    if (requestObj.sessionId) {
                        sessionId = requestObj.sessionId;
                    } else {
                        sessionId = requestObj.session.sessionId;
                    }
                    let helperPathLocal = `${helperPath}session_${sessionId}`;
                    let requestsPath = helperPathLocal + '/requests.json';
                    let requests = [];
                    if ((requestObj.session && requestObj.session.new) || requestObj.originalRequest.data.conversation.type === 'NEW') {
                        if (fs.existsSync(requestsPath)) {
                            fs.unlinkSync(requestsPath);
                        }
                    }
                    if (!fs.existsSync(helperPathLocal)) {
                        fs.mkdirSync(helperPathLocal, '0777', true);
                    }
                    if (fs.existsSync(requestsPath)) {
                        requests = JSON.parse(fs.readFileSync(requestsPath));
                    }
                    requests.push(requestObj);
                    fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 4));
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
                    let helperPathLocal = `${helperPath}session_${sessionId}`;
                    let responsesPath = helperPathLocal + '/responses.json';
                    let responses = [];
                    // TODO redundant
                    if (!fs.existsSync(helperPathLocal)) {
                        fs.mkdirSync(helperPathLocal, '0777', true);
                    }
                    if (fs.existsSync(responsesPath)) {
                        responses = JSON.parse(fs.readFileSync(responsesPath));
                    }
                    responses.push(responseObj);
                    fs.writeFileSync(responsesPath, JSON.stringify(responses, null, 4));
                }
            }
        });
    }

}

module.exports.BasicLogging = BasicLogging;

