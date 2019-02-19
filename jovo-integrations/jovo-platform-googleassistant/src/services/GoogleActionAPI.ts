import * as https from "https";
import {RequestOptions} from "https";

import {GoogleActionAPIResponse} from "./GoogleActionAPIResponse";
import { GoogleActionAPIError } from "./GoogleActionAPIError";

export interface ApiCallOptions {
    endpoint: string;
    method?: string;
    path: string;
    permissionToken?: string;
    json?: any; // tslint:disable-line
}

export class GoogleActionAPI {
    /**
     *
     * @param {ApiCallOptions} options
     * @returns {Promise<any>}
     */
    static async apiCall(options: ApiCallOptions) {
        return new Promise((resolve, reject) => {
            const opt: RequestOptions = {
                hostname: options.endpoint.substr(8), // remove https://
                port: 443,
                path: options.path,
                method: options.method ? options.method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + options.permissionToken,
                },
            };
            let postData;
            if (options.json) {
                postData = JSON.stringify(options.json);

                if (!opt.headers) {
                    opt.headers = {};
                }

                opt.headers['Accept'] = 'application/json';
                opt.headers['Content-Length'] = Buffer.byteLength(postData);
            }
            const req = https.request(opt, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    let parsedData;
                    if (res.statusCode === 204) { // no content
                        resolve(new GoogleActionAPIResponse(res.statusCode, {}));
                        return;
                    }
                    try {
                        if (rawData.length > 0) {
                            parsedData = JSON.parse(rawData);
                            return resolve(new GoogleActionAPIResponse(res.statusCode, parsedData));
                        }
                    } catch (e) {
                        return reject(new GoogleActionAPIError(e.message || 'Something went wrong', e.code || GoogleActionAPIError.PARSE_ERROR));
                    }
                    resolve(new GoogleActionAPIResponse(res.statusCode, {}));
                });
            }).on('error', (e) => {
                reject(e);
            });
            if (postData) {
                req.write(postData);
            }

            req.end();
        });
    }
}