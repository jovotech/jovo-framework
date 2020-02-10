import { ApiError } from './ApiError';
import { AlexaAPI, ApiCallOptions } from './AlexaAPI';

export class AlexaReminder {
  apiEndpoint: string;
  apiAccessToken: string;

  constructor(apiEndpoint: string, apiAccessToken: string) {
    this.apiEndpoint = apiEndpoint;
    this.apiAccessToken = apiAccessToken;
  }

  /**
   * Sets reminder
   * @param {*} reminder
   * @return {Promise<any>}
   */
  async setReminder(reminder: AbsoluteReminder | RelativeReminder): Promise<ReminderResponse> {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: '/v1/alerts/reminders',
        permissionToken: this.apiAccessToken,
        json: reminder,
        method: 'POST',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.httpStatus === 401) {
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
   * Gets reminder
   * @param {string} alertToken
   * @return {Promise<any>}
   */
  async getReminder(alertToken: string): Promise<ReminderListResponse> {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: `/v1/alerts/reminders/${alertToken}`,
        permissionToken: this.apiAccessToken,
        method: 'GET',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.httpStatus === 401) {
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
   * Updates reminder
   * @param {string} alertToken
   * @param {*} reminder
   * @return {Promise<any>}
   */
  async updateReminder(alertToken: string, reminder: Reminder) {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: `/v1/alerts/reminders/${alertToken}`,
        permissionToken: this.apiAccessToken,
        json: reminder,
        method: 'PUT',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.httpStatus === 401) {
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
   * Deletes reminder
   * @param {string} alertToken
   * @return {Promise<void>}
   */
  async deleteReminder(alertToken: string) {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: `/v1/alerts/reminders/${alertToken}`,
        permissionToken: this.apiAccessToken,
        method: 'DELETE',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.httpStatus === 401) {
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
  async getAllReminders(): Promise<ReminderListResponse> {
    try {
      const options: ApiCallOptions = {
        endpoint: this.apiEndpoint,
        path: '/v1/alerts/reminders',
        permissionToken: this.apiAccessToken,
        method: 'GET',
      };
      const response: any = await AlexaAPI.apiCall(options); // tslint:disable-line

      if (response.httpStatus === 401) {
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

export interface Reminder {
  requestTime: string; // valid ISO 8601 format - describes the time when event actually occurred
  alertInfo: {
    spokenInfo: {
      content: SpokenInfoContent[];
    };
  };
  pushNotification: {
    status: string; // if a push notification should be sent or not [default = ENABLED]
  };
}

export interface AbsoluteReminder extends Reminder {
  trigger: {
    type: 'SCHEDULED_ABSOLUTE'; // Indicates type of trigger
    scheduledTime: string; // valid ISO 8601 format - Intended trigger time
    timeZoneId?: string; // def
    recurrence: {
      freq: string;
      byDay?: string[];
    };
  };
}

export interface RelativeReminder extends Reminder {
  trigger: {
    type: 'SCHEDULED_RELATIVE'; // Indicates type of trigger
    offsetInSeconds: number;
    timeZoneId?: string; // def
  };
}

export interface ReminderResponse {
  alertToken: string;
  createdTime: string;
  updatedTime: string;
  status: string;
  version: string;
  href: string;
}

export interface ReminderListResponse {
  totalCount: string;
  alerts: any[]; // tslint:disable-line
  links?: string;
}
interface SpokenInfoContent {
  locale: string; // locale in which value is specified
  text: string; // text that will be used for display and spoken purposes
}
