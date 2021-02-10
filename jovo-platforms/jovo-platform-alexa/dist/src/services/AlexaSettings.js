"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("./ApiError");
const AlexaAPI_1 = require("./AlexaAPI");
class AlexaSettings {
    static async settingsAPI(property, apiEndpoint, apiAccessToken, deviceId) {
        const validProperties = [
            AlexaSettings.TIMEZONE,
            AlexaSettings.DISTANCE_UNITS,
            AlexaSettings.TEMPERATURE_UNITS,
        ];
        if (!apiAccessToken) {
            throw new Error(`No permissionToken was found in that request`);
        }
        if (!validProperties.includes(property)) {
            throw new Error(`${property} is not a valid property`);
        }
        const options = {
            endpoint: apiEndpoint,
            path: `/v2/devices/${deviceId}/settings/System.${property}`,
            permissionToken: apiAccessToken,
        };
        try {
            const response = await AlexaAPI_1.AlexaAPI.apiCall(options);
            if (response.status === 403) {
                const { message, code } = response.data;
                const apiError = new ApiError_1.ApiError(message, code);
                if (message === 'Access to this resource has not yet been requested.') {
                    apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                if (message === 'Access to this resource cannot be requested.') {
                    apiError.code = ApiError_1.ApiError.NO_SKILL_PERMISSION; // dev needs to set correct permissions in ASK console
                }
                // skip catch
                return Promise.reject(apiError);
            }
            return response.data;
        }
        catch (e) {
            throw new ApiError_1.ApiError('Something went wrong.', ApiError_1.ApiError.ERROR);
        }
    }
}
exports.AlexaSettings = AlexaSettings;
AlexaSettings.TIMEZONE = 'timeZone';
AlexaSettings.DISTANCE_UNITS = 'distanceUnits';
AlexaSettings.TEMPERATURE_UNITS = 'temperatureUnit';
//# sourceMappingURL=AlexaSettings.js.map