"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("./ApiError");
const AlexaAPI_1 = require("./AlexaAPI");
class AlexaReminder {
    constructor(apiEndpoint, apiAccessToken) {
        this.apiEndpoint = apiEndpoint;
        this.apiAccessToken = apiAccessToken;
    }
    /**
     * Sets reminder
     * @param {*} reminder
     * @return {Promise<any>}
     */
    async setReminder(reminder) {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: '/v1/alerts/reminders',
                permissionToken: this.apiAccessToken,
                json: reminder,
                method: 'POST',
            };
            const response = await AlexaAPI_1.AlexaAPI.apiCall(options); // tslint:disable-line
            if (response.status === 401) {
                return Promise.reject(new ApiError_1.ApiError('Request Unauthorized', ApiError_1.ApiError.NO_USER_PERMISSION));
            }
            if (response.status >= 400) {
                let apiError;
                if (response.data) {
                    const { message, code } = response.data;
                    apiError = new ApiError_1.ApiError(message, code);
                    if (message === 'Request Unauthorized.') {
                        apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                    }
                }
                else {
                    apiError = new ApiError_1.ApiError('Something went wrong.', ApiError_1.ApiError.ERROR);
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
    /**
     * Gets reminder
     * @param {string} alertToken
     * @return {Promise<any>}
     */
    async getReminder(alertToken) {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: `/v1/alerts/reminders/${alertToken}`,
                permissionToken: this.apiAccessToken,
                method: 'GET',
            };
            const response = await AlexaAPI_1.AlexaAPI.apiCall(options); // tslint:disable-line
            if (response.status === 401) {
                return Promise.reject(new ApiError_1.ApiError('Request Unauthorized', ApiError_1.ApiError.NO_USER_PERMISSION));
            }
            if (response.status >= 400) {
                let apiError;
                if (response.data) {
                    const { message, code } = response.data;
                    apiError = new ApiError_1.ApiError(message, code);
                    if (message === 'Request Unauthorized.') {
                        apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                    }
                }
                else {
                    apiError = new ApiError_1.ApiError('Something went wrong.', ApiError_1.ApiError.ERROR);
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
    /**
     * Updates reminder
     * @param {string} alertToken
     * @param {*} reminder
     * @return {Promise<any>}
     */
    async updateReminder(alertToken, reminder) {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: `/v1/alerts/reminders/${alertToken}`,
                permissionToken: this.apiAccessToken,
                json: reminder,
                method: 'PUT',
            };
            const response = await AlexaAPI_1.AlexaAPI.apiCall(options); // tslint:disable-line
            if (response.status === 401) {
                return Promise.reject(new ApiError_1.ApiError('Request Unauthorized', ApiError_1.ApiError.NO_USER_PERMISSION));
            }
            if (response.status >= 400) {
                let apiError;
                if (response.data) {
                    const { message, code } = response.data;
                    apiError = new ApiError_1.ApiError(message, code);
                    if (message === 'Request Unauthorized.') {
                        apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                    }
                }
                else {
                    apiError = new ApiError_1.ApiError('Something went wrong.', ApiError_1.ApiError.ERROR);
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
    /**
     * Deletes reminder
     * @param {string} alertToken
     * @return {Promise<void>}
     */
    async deleteReminder(alertToken) {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: `/v1/alerts/reminders/${alertToken}`,
                permissionToken: this.apiAccessToken,
                method: 'DELETE',
            };
            const response = await AlexaAPI_1.AlexaAPI.apiCall(options); // tslint:disable-line
            if (response.status === 401) {
                return Promise.reject(new ApiError_1.ApiError('Request Unauthorized', ApiError_1.ApiError.NO_USER_PERMISSION));
            }
            if (response.status >= 400) {
                let apiError;
                if (response.data) {
                    const { message, code } = response.data;
                    apiError = new ApiError_1.ApiError(message, code);
                    if (message === 'Request Unauthorized.') {
                        apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                    }
                }
                else {
                    apiError = new ApiError_1.ApiError('Something went wrong.', ApiError_1.ApiError.ERROR);
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
    /**
     * Retrieves all reminders
     * @return {Promise<data>}
     */
    async getAllReminders() {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: '/v1/alerts/reminders',
                permissionToken: this.apiAccessToken,
                method: 'GET',
            };
            const response = await AlexaAPI_1.AlexaAPI.apiCall(options); // tslint:disable-line
            if (response.status === 401) {
                return Promise.reject(new ApiError_1.ApiError('Request Unauthorized', ApiError_1.ApiError.NO_USER_PERMISSION));
            }
            if (response.status >= 400) {
                let apiError;
                if (response.data) {
                    const { message, code } = response.data;
                    apiError = new ApiError_1.ApiError(message, code);
                    if (message === 'Request Unauthorized.') {
                        apiError.code = ApiError_1.ApiError.NO_USER_PERMISSION; // user needs to grant access in app
                    }
                }
                else {
                    apiError = new ApiError_1.ApiError('Something went wrong.', ApiError_1.ApiError.ERROR);
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
exports.AlexaReminder = AlexaReminder;
//# sourceMappingURL=AlexaReminder.js.map