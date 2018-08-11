'use strict';
const https = require('https');
const _ = require('lodash');

/**
 * Class InSkillPurchase
 */
class InSkillPurchase {

    /**
     * Constructor
     * @param {Jovo} jovo
     */
    constructor(jovo) {
        this.jovo = jovo;
        this.response = jovo.alexaSkill().getResponse();
    }

    /**
     * Verifies if user's account is valid for en-US ISP feature
     * @return {boolean}
     */
    isIspAllowed() {
        const ALLOWED_ISP_ENDPOINTS = {
            'en-US': 'https://api.amazonalexa.com',
        };

        const locale = this.jovo.getLocale();
        const endpoint = this.jovo.getPlatform().getApiEndpoint();

        return ALLOWED_ISP_ENDPOINTS[locale] === endpoint;
    }

    /**
     * Sends buy request
     * @param {string} productId your product id in the format amzn1.adg.product
     * @param {string} token
     */
    buy(productId, token) {
        this.response.addDirective({
            type: 'Connections.SendRequest',
            name: 'Buy',
            payload: {
                InSkillProduct: {
                    productId: productId,
                },
            },
            token: token || 'token',
        });
        this.jovo.respond();
    }

    /**
     * Sends upsell request
     * @param {string} productId
     * @param {string} upsellMessage
     * @param {string} token
     */
    upsell(productId, upsellMessage, token) {
        this.response.addDirective({
            type: 'Connections.SendRequest',
            name: 'Upsell',
            payload: {
                InSkillProduct: {
                    productId: productId,
                },
                upsellMessage: upsellMessage,
            },
            token: token || 'token',
        });
        this.jovo.respond();
    }

    /**
     * Sends cancel request
     * @param {string} productId
     * @param {string} token
     */
    cancel(productId, token) {
        this.response.addDirective({
            type: 'Connections.SendRequest',
            name: 'Cancel',
            payload: {
                InSkillProduct: {
                    productId: productId,
                },
            },
            token: token || 'token',
        });
        this.jovo.respond();
    }

    /**
     * Returns purchase request payload
     * @return {*}
     */
    getPayload() {
        return _.get(this.jovo.request(), 'request.payload');
    }

    /**
     * Returns purchase result
     * @return {*}
     */
    getPurchaseResult() {
        return _.get(this.jovo.request(), 'request.payload.purchaseResult');
    }

    /**
     * Returns purchase product id
     * @return {*}
     */
    getProductId() {
        return _.get(this.jovo.request(), 'request.payload.productId');
    }

    /**
     * Calls buy after retrieving product id
     * @param {string} referenceName
     * @param {string} token
     */
    buyByReferenceName(referenceName, token) {
        this.getProductByReferenceName(referenceName, (error, product) => {
            this.buy(product.productId, token);
        });
    }

    /**
     * Calls buy after retrieving product id
     * @param {string} referenceName
     * @param {string} upsellMessage
     * @param {string} token
     */
    upsellByReferenceName(referenceName, upsellMessage, token) {
        this.getProductByReferenceName(referenceName, (error, product) => {
            this.upsell(product.productId, upsellMessage, token);
        });
    }

    /**
     * Calls cancel after retrieving product id
     * @param {string} referenceName
     * @param {string} token
     */
    cancelByReferenceName(referenceName, token) {
        this.getProductByReferenceName(referenceName, (error, product) => {
            this.cancel(product.productId, token);
        });
    }

    /**
     * Returns product by reference name
     * @param {string} referenceName
     * @param {string} callback
     */
    getProductByReferenceName(referenceName, callback) {
        this.getProductList((error, result) => {
            if (error) {
                callback(error);
            } else {
                for (let item of result.inSkillProducts) {
                    if (item.referenceName === referenceName) {
                        return callback(null, item);
                    }
                }
                callback(null, {});
            }
        });
    }

    /**
     * Returns productlist
     * @param {function} callback
     */
    getProductList(callback) {
        // The API path
        const apiPath = '/v1/users/~current/skills/~current/inSkillProducts';

        const options = {
            hostname: this.jovo.request().getApiEndpoint().substr(8),
            port: 443,
            path: apiPath,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': this.jovo.getLocale(),
                'Authorization': 'Bearer ' + this.jovo.request().getApiAccessToken(),
            },
        };
        let returnData = [];
        const req = https.get(options, (res) => {
            res.setEncoding('utf8');

            if (res.statusCode !== 200) {
                callback(new Error('Something went wrong'));
            }

            res.on('data', (chunk) => {
                returnData += chunk;
            });

            res.on('end', () => {
                try {
                    let inSkillProductInfo = JSON.parse(returnData);
                    callback(null, inSkillProductInfo);
                } catch (error) {
                    callback(error);
                }
            });
        });

        req.on('error', (e) => {
            callback(e);
        });
    }
}

module.exports.InSkillPurchase = InSkillPurchase;
