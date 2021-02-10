"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("./ApiError");
const jovo_core_1 = require("jovo-core");
class AlexaAPI {
    /**
     * @param {ApiCallOptions} options
     * @returns {Promise<AxiosResponse<T | ApiErrorData>>>}
     */
    // tslint:disable-next-line:no-any
    static apiCall(options) {
        const url = options.endpoint + options.path;
        const config = {
            data: options.json,
            url,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${options.permissionToken}`,
            },
            validateStatus: (status) => {
                return true;
            },
        };
        return jovo_core_1.HttpService.request(config);
    }
    static async progressiveResponse(speech, requestId, apiEndPoint, apiAccessToken) {
        const outputSpeech = speech.toString();
        const data = {
            header: {
                requestId,
            },
            directive: {
                type: 'VoicePlayer.Speak',
                speech: jovo_core_1.SpeechBuilder.toSSML(outputSpeech),
            },
        };
        const url = `${apiEndPoint}/v1/directives`;
        const config = {
            data,
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiAccessToken}`,
            },
        };
        try {
            await jovo_core_1.HttpService.request(config);
            return;
        }
        catch (e) {
            throw new ApiError_1.ApiError(e.message);
        }
    }
    /**
     * TODO
     * Proactive Events Authorization API call
     */
    static async proactiveEventAuthorization(clientId, clientSecret) {
        const url = `https://api.amazon.com/auth/O2/token`;
        const data = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=alexa::proactive_events`;
        const config = {
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data,
        };
        try {
            const response = await jovo_core_1.HttpService.request(config);
            return response.data;
        }
        catch (e) {
            throw new ApiError_1.ApiError(e.message);
        }
    }
}
exports.AlexaAPI = AlexaAPI;
//# sourceMappingURL=AlexaAPI.js.map