'use strict';

/**
 *
 * @author Ruben Aegerter
 */

const Plugin = require('../plugin').Plugin;
const util = require('../../util');
const fs = require('fs');
const path = require('path');

/**
 * Record Logging
 */
class RecordLogging extends Plugin {

    /**
     * Constructor
     * @param {boolean} recording
     * @param {string} recordingName
     */
    constructor(recording, recordingName) {
        super();
        if (typeof recording === 'boolean' && recording === true) {
            if (recordingName !== 'true') {
                this.recordingName = recordingName;
            }
            this.alexaIndex = 0;
            this.googleActionIndex = 0;
            this.index = 0;
            this.record = true;
        } else {
            this.record = false;
        }
    }

    /**
     * Initializes listeners
     */
    init() {
        this.app.on('request', (jovo) => {

        });

        this.app.on('response', (jovo) => {
            if (this.options.requestLogging && this.record) {
                let requestObj = jovo.requestObj;

                // check wether request is alexa or google action based
                if (jovo.getPlatform().getType() === 'GoogleAction') {
                    this.googleActionIndex += 1;
                    this.index = this.googleActionIndex;
                } else {
                    this.alexaIndex += 1;
                    this.index = this.alexaIndex;
                }

                this.sessionPath = `.${path.sep}test${path.sep}recordings${path.sep}` +
                    `${this.recordingName}${path.sep}${jovo.getPlatform().getType()}${path.sep}`;

                if (!fs.existsSync(this.sessionPath)) {
                    util.makeDirRecursive(this.sessionPath);
                }

                try {
                    this.intentName = jovo.getIntentName();
                } catch (err) {
                    this.intentName = jovo.handler.route.path;
                }
                this.intentName = this.intentName.replace('[', '_');
                this.intentName = this.intentName.replace(/['"]+/g, '');
                this.intentName = this.intentName.replace(']', '');
                let requestsPath = `${this.sessionPath}${this.index < 10 ? '0' : ''}${this.index}_` +
                    `req_${this.intentName}.json`;
                fs.writeFileSync(requestsPath, JSON.stringify(requestObj, null, 4));
            }
            // log response object
            if (this.options.responseLogging && this.record) {
                let responseObj = jovo.getPlatform().getResponseObject();

                let responsesPath = `${this.sessionPath}${this.index < 10 ? '0' : ''}${this.index}_` +
                    `res_${this.intentName}.json`;
                fs.writeFileSync(responsesPath, JSON.stringify(responseObj, null, 4));
            }
        });
    }
}

module.exports.RecordLogging = RecordLogging;

