import { AlexaAPI, ApiCallOptions } from './AlexaAPI';
import { ApiError } from './ApiError';
import _camelCase = require('lodash.camelcase');

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
      AlexaContact.MOBILE_NUMBER,
    ];
    if (!permissionToken) {
      throw new ApiError('No permissions from user.', ApiError.NO_USER_PERMISSION);
    }

    if (!validProperties.includes(property)) {
      throw new Error(`${property} is not a valid property`);
    }

    const options: ApiCallOptions = {
      endpoint: apiEndpoint,
      path: `/v2/accounts/~current/settings/Profile.${_camelCase(property)}`,
      permissionToken,
    };
    try {
      const response = await AlexaAPI.apiCall(options);

      if (response.status === 403) {
        const { message, code } = response.data;
        const apiError = new ApiError(message, code);

        if (message === 'The authentication token is not valid.') {
          apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
        }

        if (message === 'Access to this resource has not yet been requested.') {
          apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
        }

        if (message === 'Access to this resource cannot be requested.') {
          apiError.code = ApiError.NO_SKILL_PERMISSION; // dev needs to set correct permissions in ASK console
        }

        if (code === 'ACCESS_DENIED' && message === 'Access denied with reason: FORBIDDEN') {
          apiError.code = ApiError.NO_SKILL_PERMISSION; // dev needs to set correct permissions in ASK console
        }

        if (
          code === 'ACCESS_DENIED' &&
          message === 'Access denied with reason: ACCESS_NOT_REQUESTED'
        ) {
          apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
        }
        // skip catch
        return Promise.reject(apiError);
      }
      return response.data;
    } catch (e) {
      throw new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR);
    }
  }
}
