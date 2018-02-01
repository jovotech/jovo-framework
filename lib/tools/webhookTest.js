'use strict';

let AlexaResponse = require('../platforms/alexaSkill/alexaResponse').AlexaResponse;
const RequestBuilderAlexaSkill = require('../platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;
const http = require('http');

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
        // let webhookUrl = this.webhookUrl;
        return new Promise((resolve, reject) => {
            let opt = {
                hostname: 'localhost', // remove https://
                port: 3000,
                path: '/webhook',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            let postData = JSON.stringify(requestObj);

            let req = http.request(opt, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    let parsedData;
                    try {
                        parsedData = JSON.parse(rawData);
                    } catch (e) {
                        reject(new Error('Something went wrong'));
                        return;
                    }

                    resolve(new AlexaResponse(parsedData));
                });
            }).on('error', (e) => {
                if (e.code === 'ECONNRESET') {
                   console.log('Timeout error: No response after ' + RESPONSE_TIMEOUT + ' milliseconds');
                }
                reject(e);
            }).on('socket', function(socket) {
                socket.setTimeout(RESPONSE_TIMEOUT);
                socket.on('timeout', function() {
                    req.abort();
                });
            });
            req.write(postData);

            req.end();
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
     * @param {AlexaRequest} request
     * @return {Promise}
     */
    testRequest(request) {
        return this.post(request);
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
