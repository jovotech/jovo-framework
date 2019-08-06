import {ApiError} from "./ApiError";
import _camelCase = require('lodash.camelcase');

import {AlexaAPI, ApiCallOptions} from "./AlexaAPI";


export class AlexaContact {

    static NAME = 'name';
    static GIVEN_NAME = 'given_name';
    static EMAIL = 'email';
    static MOBILE_NUMBER = 'mobile_number';

    static async contactAPI(property: string, apiEndpoint: string, permissionToken: string) {
        const validProperties = [
            AlexaContact.NAME,
            AlexaContact.GIVEN_NAME,
            AlexaContact.EMAIL,
            AlexaContact.MOBILE_NUMBER
        ];
        if (!permissionToken) {
            return Promise.reject(new ApiError('No permissions from user.', ApiError.NO_USER_PERMISSION));
        }

        if (!validProperties.includes(property)) {
            return Promise.reject(new Error(`${property} is not a valid property`));
        }

        const options: ApiCallOptions = {
            endpoint: apiEndpoint,
            path: `/v2/accounts/~current/settings/Profile.${_camelCase(property)}`,
            permissionToken,
        };
        try {
            const response:any = await AlexaAPI.apiCall(options); // tslint:disable-line

            if (response.httpStatus === 403) {
                const apiError = new ApiError(response.data.message, response.data.code);
                if (response.data.message === 'Access to this resource has not yet been requested.') {
                    apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                }

                if (response.data.message === 'Access to this resource cannot be requested.') {
                    apiError.code = ApiError.NO_SKILL_PERMISSION; // dev needs to set correct permissions in ASK console
                }
                return Promise.reject(apiError);
            }
            return Promise.resolve(response.data);
        } catch (e) {
           return Promise.reject(new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR));
        }
    }
}
