import {ApiError} from "./ApiError";
import {AlexaAPI} from "./AlexaAPI";


export class AlexaSettings {

    static TIMEZONE = 'timeZone';
    static DISTANCE_UNITS = 'distanceUnits';
    static TEMPERATURE_UNITS = 'temperatureUnit';



    static async settingsAPI(property: string, apiEndpoint: string, apiAccessToken: string, deviceId: string) {
        const validProperties = [
            AlexaSettings.TIMEZONE,
            AlexaSettings.DISTANCE_UNITS,
            AlexaSettings.TEMPERATURE_UNITS,
        ];
        if (!apiAccessToken) {
            return Promise.reject(new Error(`No permissionToken was found in that request`));
        }

        if (!validProperties.includes(property)) {
            return Promise.reject(new Error(`${property} is not a valid property`));
        }

        const options: any = { // tslint:disable-line
            endpoint: apiEndpoint,
            path: `/v2/devices/${deviceId}/settings/System.${property}`,
            permissionToken: apiAccessToken,
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
           return Promise.reject(new ApiError('Something went wrong.', ApiError.ERROR));
        }
    }
}
