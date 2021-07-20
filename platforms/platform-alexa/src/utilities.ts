import _camelCase from 'lodash.camelcase';
import {
  axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  JovoError,
  Method,
} from '@jovotech/framework';
import { AlexaApiError, AlexaApiErrorCode } from './AlexaApiError';

export interface AlexaApiOptions extends AxiosRequestConfig {
  endpoint: string;
  path: string;
  permissionToken: string;
  method?: Method;
  data?: Record<string, unknown>;
}

export enum ProfileProperty {
  NAME = 'name',
  GIVEN_NAME = 'givenName',
  EMAIL = 'email',
  MOBILE_NUMBER = 'mobileNumber',
}

export async function requestContactApi(
  profileProperty: ProfileProperty,
  apiEndpoint: string,
  permissionToken?: string,
): Promise<any> {
  // Validate parameters
  if (!permissionToken) {
    throw new JovoError({
      message: 'No permissions granted from user.',
    });
  }

  const options: AlexaApiOptions = {
    endpoint: apiEndpoint,
    path: `/v2/accounts/~current/settings/Profile.${profileProperty}`,
    permissionToken,
  };

  try {
    const response = await apiCall(options);
    return response.data;
  } catch (error) {
    if (error.isAxiosError) {
      const { message, code } = error.response;
      let errorCode: AlexaApiErrorCode = AlexaApiErrorCode.ERROR;

      // User needs to grant access in app
      if (
        message === 'The authentication token is not valid.' ||
        message === 'Access to this resource has not yet been requested.' ||
        (code === 'ACCESS_DENIED' && message === 'Access denied with reason: ACCESS_NOT_REQUESTED')
      ) {
        errorCode = AlexaApiErrorCode.NO_USER_PERMISSION;
      }

      // Dev needs to set correct permissions in ASK console
      if (
        message === 'Access to this resource cannot be requested.' ||
        (code === 'ACCESS_DENIED' && message === 'Access denied with reason: FORBIDDEN')
      ) {
        errorCode = AlexaApiErrorCode.NO_SKILL_PERMISSION;
      }

      return Promise.reject(new AlexaApiError({ message: error.message, code: errorCode }));
    }
  }
}

export async function apiCall<T>(options: AlexaApiOptions): Promise<AxiosResponse<T | AxiosError>> {
  const url = `${options.endpoint}${options.path}`;

  const config: AxiosRequestConfig = {
    url,
    data: options.data,
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${options.permissionToken}`,
    },
  };

  return await axios(config);
}
