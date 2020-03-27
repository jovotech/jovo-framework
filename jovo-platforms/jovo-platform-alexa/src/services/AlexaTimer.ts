import { ApiError } from './ApiError';
import { AlexaAPI, ApiCallOptions } from './AlexaAPI';

export class AlexaTimer {
  apiEndpoint: string;
  apiAccessToken: string;

  constructor(apiEndpoint: string, apiAccessToken: string) {
    this.apiEndpoint = apiEndpoint;
    this.apiAccessToken = apiAccessToken;
  }

  async setTimer(timer: NotifyOnlyTimer | AnnounceTimer | LaunchTaskTimer): Promise<TimerResponse> {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: '/v1/alerts/timers',
        permissionToken: this.apiAccessToken,
        json: timer,
        method: 'POST',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.status === 401) {
        return Promise.reject(new ApiError('Request Unauthorized', ApiError.NO_USER_PERMISSION));
      }
      if (response.status >= 400) {
        let apiError;
        if (response.data) {
          const { message, code } = response.data;
          apiError = new ApiError(message, code);
          if (message === 'Request Unauthorized.') {
            apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
          }
        } else {
          apiError = new ApiError('Something went wrong.', ApiError.ERROR);
        }
        // skip catch
        return Promise.reject(apiError);
      }
      return response.data;
    } catch (e) {
      throw new ApiError('Something went wrong.', ApiError.ERROR);
    }
  }

  /**
   * Gets Timer
   * @param {string} id
   * @return {Promise<any>}
   */
  async getTimer(id: string): Promise<TimerListResponse> {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: `/v1/alerts/reminders/${id}`,
        permissionToken: this.apiAccessToken,
        method: 'GET',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.status === 401) {
        return Promise.reject(new ApiError('Request Unauthorized', ApiError.NO_USER_PERMISSION));
      }
      if (response.status >= 400) {
        let apiError;
        if (response.data) {
          const { message, code } = response.data;
          apiError = new ApiError(message, code);
          if (message === 'Request Unauthorized.') {
            apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
          }
        } else {
          apiError = new ApiError('Something went wrong.', ApiError.ERROR);
        }
        // skip catch
        return Promise.reject(apiError);
      }
      return response.data;
    } catch (e) {
      throw new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR);
    }
  }

  /**
   * Deletes specific timer
   * @param {string} id
   * @return {Promise<void>}
   */
  async cancelTimer(id: string) {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: `/v1/alerts/timers/${id}`,
        permissionToken: this.apiAccessToken,
        method: 'DELETE',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.status === 401) {
        return Promise.reject(new ApiError('Request Unauthorized', ApiError.NO_USER_PERMISSION));
      }
      if (response.status >= 400) {
        let apiError;
        if (response.data) {
          const { message, code } = response.data;
          apiError = new ApiError(message, code);
          if (message === 'Request Unauthorized.') {
            apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
          }
        } else {
          apiError = new ApiError('Something went wrong.', ApiError.ERROR);
        }
        // skip catch
        return Promise.reject(apiError);
      }
      return response.data;
    } catch (e) {
      throw new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR);
    }
  }

  /**
   * Deletes specific timer
   * @param {string} id
   * @return {Promise<void>}
   */
  async pauseTimer(id: string) {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: `/v1/alerts/timers/${id}/pause`,
        permissionToken: this.apiAccessToken,
        method: 'POST',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.status === 401) {
        return Promise.reject(new ApiError('Request Unauthorized', ApiError.NO_USER_PERMISSION));
      }
      if (response.status >= 400) {
        let apiError;
        if (response.data) {
          const { message, code } = response.data;
          apiError = new ApiError(message, code);
          if (message === 'Request Unauthorized.') {
            apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
          }
        } else {
          apiError = new ApiError('Something went wrong.', ApiError.ERROR);
        }
        // skip catch
        return Promise.reject(apiError);
      }
      return response.data;
    } catch (e) {
      throw new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR);
    }
  }

  /**
   * Deletes specific timer
   * @param {string} id
   * @return {Promise<void>}
   */
  async resumeTimer(id: string) {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: `/v1/alerts/timers/${id}/resume`,
        permissionToken: this.apiAccessToken,
        method: 'POST',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.status === 401) {
        return Promise.reject(new ApiError('Request Unauthorized', ApiError.NO_USER_PERMISSION));
      }
      if (response.status >= 400) {
        let apiError;
        if (response.data) {
          const { message, code } = response.data;
          apiError = new ApiError(message, code);
          if (message === 'Request Unauthorized.') {
            apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
          }
        } else {
          apiError = new ApiError('Something went wrong.', ApiError.ERROR);
        }
        // skip catch
        return Promise.reject(apiError);
      }
      return response.data;
    } catch (e) {
      throw new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR);
    }
  }

  /**
   * Deletes all timer
   * @param {string} id
   * @return {Promise<void>}
   */
  async cancelAllTimers() {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: `/v1/alerts/timers`,
        permissionToken: this.apiAccessToken,
        method: 'DELETE',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.status === 401) {
        return Promise.reject(new ApiError('Request Unauthorized', ApiError.NO_USER_PERMISSION));
      }
      if (response.status >= 400) {
        let apiError;
        if (response.data) {
          const { message, code } = response.data;
          apiError = new ApiError(message, code);
          if (message === 'Request Unauthorized.') {
            apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
          }
        } else {
          apiError = new ApiError('Something went wrong.', ApiError.ERROR);
        }
        // skip catch
        return Promise.reject(apiError);
      }
      return response.data;
    } catch (e) {
      throw new ApiError(e.message || 'Something went wrong.', e.code || ApiError.ERROR);
    }
  }

  /**
   * Retrieves all reminders
   * @return {Promise<data>}
   */
  async getAllTimers(): Promise<TimerListResponse> {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: '/v1/alerts/timers',
        permissionToken: this.apiAccessToken,
        method: 'GET',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.status === 401) {
        return Promise.reject(new ApiError('Request Unauthorized', ApiError.NO_USER_PERMISSION));
      }
      if (response.status >= 400) {
        let apiError;
        if (response.data) {
          const { message, code } = response.data;
          apiError = new ApiError(message, code);
          if (message === 'Request Unauthorized.') {
            apiError.code = ApiError.NO_USER_PERMISSION; // user needs to grant access in app
          }
        } else {
          apiError = new ApiError('Something went wrong.', ApiError.ERROR);
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

export type TriggeringBehaviorOperation = 'NOTIFY_ONLY' | 'ANNOUNCE' | 'LAUNCH_TASK';

export interface Timer {
  duration: string; //	ISO-8601 representation of duration e.g. PT10M
  timerLabel: string;
  creationBehavior: {
    displayExperience: {
      visibility: 'VISIBLE' | 'HIDDEN';
    };
  };
}

export interface NotifyOnlyTimer extends Timer {
  triggeringBehavior: {
    operation: {
      type: 'NOTIFY_ONLY';
    };
    notificationConfig: {
      playAudible: boolean;
    };
  };
}

export interface TextToAnnounce {
  locale: string;
  text: string;
}

export interface AnnounceTimer extends Timer {
  triggeringBehavior: {
    operation: {
      type: 'ANNOUNCE';
      textToAnnounce: TextToAnnounce[];
    };
    notificationConfig: {
      playAudible: boolean;
    };
  };
}

export interface TextToConfirm {
  locale: string;
  text: string;
}
export interface LaunchTaskTimer extends Timer {
  triggeringBehavior: {
    operation: {
      type: 'LAUNCH_TASK';
      task: {
        name: string;
        version: string;
        // tslint:disable-next-line:no-any
        input?: any;
      };
      textToConfirm: TextToConfirm[];
    };
    notificationConfig: {
      playAudible: boolean;
    };
  };
}

export type TimerStatus = 'ON' | 'PAUSED' | 'OFF';
export interface TimerResponse {
  id: string;
  status: TimerStatus;
  duration: string;
  triggerTime: string; // ISO-8601 representation of a specified time
  timerLabel: string; // ISO-8601 representation of duration e.g. PT10M
  createdTime: string; // ISO-8601 representation of a specified time
  updatedTime: string; // ISO-8601 representation of a specified time
  remainingTimeWhenPaused: string; // ISO-8601 representation of duration e.g. PT10M
}
export interface TimerListResponse {
  totalCount: string;
  timers: TimerResponse[]; // tslint:disable-line
  links?: string;
}
