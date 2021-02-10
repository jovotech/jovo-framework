"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaAPI_1 = require("./AlexaAPI");
const ApiError_1 = require("./ApiError");
const _camelCase = require("lodash.camelcase");
class AlexaContact {
    static async contactAPI(property, apiEndpoint, permissionToken) {
        const validProperties = [
            AlexaContact.NAME,
            AlexaContact.GIVEN_NAME,
            AlexaContact.EMAIL,
            AlexaContact.MOBILE_NUMBER,
        ];
        if (!permissionToken) {
            throw new ApiError_1.ApiError('No permissions from user.', ApiError_1.ApiError.NO_USER_PERMISSION);
        }
        if (!validProperties.includes(property)) {
            throw new Error(`${property} is not a valid property`);
        }
        const options = {
            endpoint: apiEndpoint,
            path: `/v2/accounts/~current/settings/Profile.${_camelCase(property)}`,
            permissionToken,
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
            throw new ApiError_1.ApiError(e.message || 'Something went wrong.', e.code || ApiError_1.ApiError.ERROR);
        }
    }
}
exports.AlexaContact = AlexaContact;
AlexaContact.NAME = 'name';
AlexaContact.GIVEN_NAME = 'given_name';
AlexaContact.EMAIL = 'email';
AlexaContact.MOBILE_NUMBER = 'mobile_number';
//# sourceMappingURL=AlexaContact.js.map