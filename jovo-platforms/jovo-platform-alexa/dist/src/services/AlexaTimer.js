"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("./ApiError");
const AlexaAPI_1 = require("./AlexaAPI");
class AlexaTimer {
    constructor(apiEndpoint, apiAccessToken) {
        this.apiEndpoint = apiEndpoint;
        this.apiAccessToken = apiAccessToken;
    }
    async setTimer(timer) {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: '/v1/alerts/timers',
                permissionToken: this.apiAccessToken,
                json: timer,
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
     * Gets Timer
     * @param {string} id
     * @return {Promise<any>}
     */
    async getTimer(id) {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: `/v1/alerts/reminders/${id}`,
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
     * Deletes specific timer
     * @param {string} id
     * @return {Promise<void>}
     */
    async cancelTimer(id) {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: `/v1/alerts/timers/${id}`,
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
     * Deletes specific timer
     * @param {string} id
     * @return {Promise<void>}
     */
    async pauseTimer(id) {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: `/v1/alerts/timers/${id}/pause`,
                permissionToken: this.apiAccessToken,
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
            throw new ApiError_1.ApiError(e.message || 'Something went wrong.', e.code || ApiError_1.ApiError.ERROR);
        }
    }
    /**
     * Deletes specific timer
     * @param {string} id
     * @return {Promise<void>}
     */
    async resumeTimer(id) {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: `/v1/alerts/timers/${id}/resume`,
                permissionToken: this.apiAccessToken,
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
            throw new ApiError_1.ApiError(e.message || 'Something went wrong.', e.code || ApiError_1.ApiError.ERROR);
        }
    }
    /**
     * Deletes all timer
     * @param {string} id
     * @return {Promise<void>}
     */
    async cancelAllTimers() {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: `/v1/alerts/timers`,
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
    async getAllTimers() {
        try {
            const options = {
                endpoint: this.apiEndpoint,
                path: '/v1/alerts/timers',
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
exports.AlexaTimer = AlexaTimer;
//# sourceMappingURL=AlexaTimer.js.map