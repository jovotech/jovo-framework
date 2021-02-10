"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaAPI_1 = require("./AlexaAPI");
const ApiError_1 = require("./ApiError");
class AlexaDeviceAddress {
    static async deviceAddressApi(property, apiEndpoint, apiAccessToken, deviceId) {
        const validProperties = [
            AlexaDeviceAddress.ADDRESS,
            AlexaDeviceAddress.COUNTRY_AND_POSTAL_CODE,
        ];
        if (!apiAccessToken) {
            throw new Error(`No apiAccessToken was found in that request`);
        }
        if (!validProperties.includes(property)) {
            throw new Error(`${property} is not a valid property`);
        }
        const options = {
            endpoint: apiEndpoint,
            path: '/v1/devices/' + deviceId + '/settings/' + property,
            permissionToken: apiAccessToken,
        };
        try {
            const response = await AlexaAPI_1.AlexaAPI.apiCall(options);
            if (response.status === 403) {
                const { message, code } = response.data;
                const apiError = new ApiError_1.ApiError(message, code);
                if (message === 'The authentication token is not valid.') {
                    apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                if (message === 'Access to this resource has not yet been requested.') {
                    apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }
                if (message === 'Access to this resource cannot be requested.') {
                    apiError.code = ApiError_1.ApiError.NO_SKILL_PERMISSION; // dev needs to set correct permissions in ASK console
                }
                if (code === 'ACCESS_DENIED' && message === 'Access denied with reason: FORBIDDEN') {
                    apiError.code = ApiError_1.ApiError.NO_SKILL_PERMISSION; // dev needs to set correct permissions in ASK console
                }
                if (code === 'ACCESS_DENIED' &&
                    message === 'Access denied with reason: ACCESS_NOT_REQUESTED') {
                    apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // dev needs to set correct permissions in ASK console
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
exports.AlexaDeviceAddress = AlexaDeviceAddress;
AlexaDeviceAddress.ADDRESS = 'address';
AlexaDeviceAddress.COUNTRY_AND_POSTAL_CODE = 'address/countryAndPostalCode';
//# sourceMappingURL=AlexaDeviceAddress.js.map