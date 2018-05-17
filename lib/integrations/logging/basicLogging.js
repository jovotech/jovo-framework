'use strict';

const Plugin = require('../plugin').Plugin;
const _ = require('lodash');


/**
 * Basic Logging
 */
class BasicLogging extends Plugin {
    /**
     * Constructor
     * @param {*} options
     */
    constructor(options) {
        super(options);
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
            }
        });
    }

}

module.exports.BasicLogging = BasicLogging;
