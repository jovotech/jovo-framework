'use strict';

const request = require('request');

let AlexaResponse = require('../platforms/alexa/alexaResponse').AlexaResponse;
const RequestBuilderAlexaSkill = require('../../lib/platforms/alexa/request/util/requestBuilder').RequestBuilder;


const RESPONSE_TIMEOUT = 5000;
/**
 * Webhook logic tester
 */
class WebhookTest {
    /**
     * Constructor
     * @param {{}} config
     */
    constructor(config) {
        this.webhookUrl = config && config.webhookUrl ? config.webhookUrl : 'http://localhost:3000/webhook';
    }

    /**
     * Posts request object to webhook
     * @param {{}} requestObj
     * @return {Promise}
     */
    post(requestObj) {
        let webhookUrl = this.webhookUrl;
        return new Promise((resolve, reject) => {
            let options = {
                uri: webhookUrl,
                method: 'POST',
                json: requestObj,
                timeout: RESPONSE_TIMEOUT,
            };
            request(options, function(error, response, body) {
                if (error || response.statusCode !== 200) {
                    if (error.code === 'ESOCKETTIMEDOUT') {
                       console.log('Timeout error: No response after ' + RESPONSE_TIMEOUT + ' milliseconds');
                    }
                    reject(error);
                }
                resolve(new AlexaResponse(body), reject);
            });
        });
    };

    /**
     * Resolves promise
     * @return {Promise}
     */
    end() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    /**
     * Tests launch request
     * @param {RequestBuilderAlexaSkill} launchRequest
     * @return {Promise}
     */
    testLaunch(launchRequest) {
        if (!launchRequest) {
            launchRequest = RequestBuilderAlexaSkill
                .launchRequest()
                .buildHttpRequest();
        }
        return this.post(launchRequest);
    }

    /**
     * Tests intent request
     * @param {string} intent
     * @return {Promise}
     */
    testIntent(intent) {
        if (typeof intent === 'string') {
            return this.post(RequestBuilderAlexaSkill
                .intentRequest(intent)
                .buildHttpRequest());
        }
        return this.post(intent);
    }

}

module.exports.WebhookTest = WebhookTest;
