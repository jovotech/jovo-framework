"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const ApiError_1 = require("./ApiError");
const AlexaApiResponse_1 = require("./AlexaApiResponse");
var AmazonPayApiHost;
(function (AmazonPayApiHost) {
    AmazonPayApiHost["EU"] = "pay-api.amazon.eu";
    AmazonPayApiHost["NA"] = "pay-api.amazon.com";
    AmazonPayApiHost["JP"] = "pay-api.amazon.jp";
})(AmazonPayApiHost || (AmazonPayApiHost = {}));
class AmazonPayAPI {
    static async getBuyerId(options) {
        const apiRequestOptions = {
            port: 443,
            hostname: options.host,
            path: '/live/v1/buyer/id',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + options.apiAccessToken,
            },
        };
        try {
            const response = await AmazonPayAPI.apiCall(apiRequestOptions); // tslint:disable-line
            if (response.httpStatus !== 200) {
                const apiError = new ApiError_1.ApiError(response.data.errorDescription, response.data.errorCode);
                return Promise.reject(apiError);
            }
            return Promise.resolve(response.data);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async getBuyerAddress(options) {
        const apiRequestOptions = {
            port: 443,
            hostname: options.host,
            path: `/live/v1/buyer/addresses?sellerId=${options.sellerId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + options.apiAccessToken,
            },
        };
        if (options.sandbox) {
            apiRequestOptions.path = `/sandbox/v1/buyer/addresses?sellerId=${options.sellerId}`;
            apiRequestOptions.headers['x-amz-pay-sandbox-email-id'] = options.sandboxEmail;
        }
        try {
            const response = await AmazonPayAPI.apiCall(apiRequestOptions); // tslint:disable-line
            if (response.httpStatus !== 200) {
                const apiError = new ApiError_1.ApiError(response.data.errorDescription, response.data.errorCode);
                return Promise.reject(apiError);
            }
            return Promise.resolve(response.data);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    // tslint:disable-next-line
    static async apiCall(options) {
        return new Promise((resolve, reject) => {
            const req = https
                .request(options, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    let parsedData;
                    if (res.statusCode === 204) {
                        // no content
                        resolve(new AlexaApiResponse_1.AlexaApiResponse(res.statusCode, {}));
                        return;
                    }
                    try {
                        if (rawData.length > 0) {
                            parsedData = JSON.parse(rawData);
                            return resolve(new AlexaApiResponse_1.AlexaApiResponse(res.statusCode, parsedData));
                        }
                    }
                    catch (e) {
                        return reject(new ApiError_1.ApiError(e.message || 'Something went wrong', e.code || ApiError_1.ApiError.PARSE_ERROR));
                    }
                    resolve(new AlexaApiResponse_1.AlexaApiResponse(res.statusCode, {}));
                });
            })
                .on('error', (e) => {
                reject(e);
            });
            req.end();
        });
    }
    /**
     * Maps the parsed Alexa API endpoint to the Amazon Pay API host.
     * There is a separate one for NA, EU (+ UK) and JP
     * @param {string} alexaApiEndpoint e.g. "https://api.amazonalexa.com"
     * @returns {string}
     */
    static mapAlexaApiEndpointToAmazonPayApiHost(alexaApiEndpoint) {
        switch (alexaApiEndpoint) {
            case 'https://api.eu.amazonalexa.com':
                return AmazonPayApiHost.EU;
            case 'https://api.fe.amazonalexa.com':
                return AmazonPayApiHost.JP;
            default:
                return AmazonPayApiHost.NA;
        }
    }
}
exports.AmazonPayAPI = AmazonPayAPI;
//# sourceMappingURL=AmazonPayAPI.js.map