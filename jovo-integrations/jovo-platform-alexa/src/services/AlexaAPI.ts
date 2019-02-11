import * as https from "https";
import {ApiError} from "./ApiError";
import {SpeechBuilder} from "jovo-core";
import {AlexaAPIResponse} from "./AlexaAPIResponse";
import {RequestOptions} from "https";
import {AuthorizationResponse} from "../modules/ProactiveEvent";

export interface ApiCallOptions {
    endpoint: string;
    method?: string;
    path: string;
    permissionToken?: string;
    json?: any; // tslint:disable-line
}

export class AlexaAPI {
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
                        resolve(new AlexaAPIResponse(res.statusCode, {}));
                        return;
                    }
                    try {
                        if (rawData.length > 0) {
                            parsedData = JSON.parse(rawData);
                            return resolve(new AlexaAPIResponse(res.statusCode, parsedData));
                        }
                    } catch (e) {
                        return reject(new ApiError(e.message || 'Something went wrong', e.code || ApiError.PARSE_ERROR));
                    }
                    resolve(new AlexaAPIResponse(res.statusCode, {}));
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

    static progressiveResponse(speech: string | SpeechBuilder, requestId: string, apiEndPoint: string, apiAccessToken: string) {
        return new Promise((resolve, reject) => {

            const outputSpeech: string = speech.toString();

            const json = {
                header: {
                    requestId,
                },
                directive: {
                    type: 'VoicePlayer.Speak',
                    speech: SpeechBuilder.toSSML(outputSpeech),
                },
            };

            const options: RequestOptions = {
                hostname: apiEndPoint.substr(8), // remove https://
                port: 443,
                path: '/v1/directives',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiAccessToken,
                },
            };
            const req = https.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (body) => {
                });
                res.on('end', () => {
                    resolve();
                });
            });
            req.on('error', (e) => {
                reject(new ApiError(e.message));
            });
            req.write(JSON.stringify(json));
            req.end();
        });
    }

    /**
     * TODO
     * Proactive Events Authorization API call
     */
    static proactiveEventAuthorization(clientId: string, clientSecret: string): Promise<AuthorizationResponse> {
        return new Promise((resolve, reject) => {

            const body = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=alexa::proactive_events`;

            const options: RequestOptions = {
                hostname: 'api.amazon.com',
                port: 443,
                path: '/auth/O2/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                }
            };

            const req = https.request(options, (res) => {
                let returnData = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    returnData += chunk;
                });
                res.on('end', () => {
                    resolve(JSON.parse(returnData));
                });
            });
            req.on('error', (e) => {
                reject(new ApiError(e.message));
            });
            req.write(body);
            req.end();
        });
    }
}