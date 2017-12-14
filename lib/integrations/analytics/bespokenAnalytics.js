'use strict';
const Jovo = require('../../jovo');
const uuid = require('uuid');
const https = require('https');
const _ = require('lodash');


/**
 * Implementation of Bespoken's analytics module
 */
class Bespoken {

    /**
     * Constructor
     * @param {*} config
     * @param {Jovo.PLATFORM_ENUM} platformType Alexa Skill or Google Action
     */
    constructor(config, platformType) {
        this.secretKey = _.get(config, 'key');
        this.platformType = platformType;
    };

    /**
     * Wraps a request or response to be sent to Bespoken Logless Server
     * @param {Object} payloads Captured request and response
     * @return {object} The request or response ready to be send to logless
     */
    createBespokenLoglessObject(payloads) {
        const logs = payloads.map((payload, index) => {
            // we always send two logs,  0 = request, 1 = response.
            const tag = index ? 'response' : 'request';
            return {
                log_type: 'INFO',
                timestamp: new Date(),
                payload: payload,
                tags: [tag],
            };
        });
        return {
            source: this.secretKey,
            transaction_id: uuid.v4(),
            logs: logs,
        };
    };

    /**
     * Send the data to logless
     * @param {object} data Wrapped request and response.
     */
    sendDataToLogless(data) {
        const objectAsString = JSON.stringify(data);
        const options = {
            host: 'logless.bespoken.tools',
            path: '/v1/receive',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const httpRequest = https.request(options);

        httpRequest.on('error', function(error) {
            console.error('Error while logging to Bespoken Services', error);
        });

        httpRequest.end(objectAsString);
    };

    /**
     * Calls the Bespoken log method
     * @param {Jovo} app jovo app object
     */
    track(app) {
        const jovoSourceObject = this.platformType === Jovo.PLATFORM_ENUM.ALEXA_SKILL ?
            app.alexaSkill() : app.googleAction();
        const jovoRequest = jovoSourceObject.getRequest();
        const jovoResponse = jovoSourceObject.getResponse();
        const payloads = this.createBespokenLoglessObject([jovoRequest, jovoResponse]);
        this.sendDataToLogless(payloads);
    };
}

/**
 * Bespoken Alexa Analytics
 */
class BespokenAlexa extends Bespoken {
    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        super(config, Jovo.PLATFORM_ENUM.ALEXA_SKILL);
    }
}

/**
 * Bespoken GoogleAction Analytics
 */
class BespokenGoogleAction extends Bespoken {
    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        super(config, Jovo.PLATFORM_ENUM.GOOGLE_ACTION);
    }
}

module.exports.BespokenAlexa = BespokenAlexa;
module.exports.BespokenGoogleAction = BespokenGoogleAction;

