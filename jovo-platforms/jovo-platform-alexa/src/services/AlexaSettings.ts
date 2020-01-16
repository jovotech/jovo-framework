import { ApiError } from './ApiError';
import { AlexaAPI } from './AlexaAPI';

export class AlexaSettings {
  static TIMEZONE = 'timeZone';
  static DISTANCE_UNITS = 'distanceUnits';
  static TEMPERATURE_UNITS = 'temperatureUnit';

  static async settingsAPI(
    property: string,
    apiEndpoint: string,
    apiAccessToken: string,
    deviceId: string,
  ) {
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
      const response = await AlexaAPI.apiCall(options);
      if (response.status === 403) {
        const { message, code } = response.data;
        const apiError = new ApiError(message, code);
        if (message === 'Access to this resource has not yet been requested.') {
          apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
        }

        if (message === 'Access to this resource cannot be requested.') {
          apiError.code = ApiError.NO_SKILL_PERMISSION; // dev needs to set correct permissions in ASK console
        }
        // skip catch
        return Promise.reject(apiError);
      }
      return response.data;
    } catch (e) {
      throw new ApiError('Something went wrong.', ApiError.ERROR);
    }
  }
}
