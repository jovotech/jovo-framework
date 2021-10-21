import { axios, AxiosRequestConfig, AxiosResponse, Method } from '@jovotech/framework';
import { JovoError, JovoErrorOptions } from '@jovotech/framework';

import { URL } from 'url';

export enum AlexaApiErrorCode {
  PARSE_ERROR = 'PARSE_ERROR',
  ACCESS_NOT_REQUESTED = 'ACCESS_NOT_REQUESTED',
  NO_USER_PERMISSION = 'NO_USER_PERMISSION',
  NO_SKILL_PERMISSION = 'NO_SKILL_PERMISSION',
  LIST_NOT_FOUND = 'LIST_NOT_FOUND',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  DEVICE_NOT_SUPPORTED = 'DEVICE_NOT_SUPPORTED',
  ALERT_NOT_FOUND = 'ALERT_NOT_FOUND',
  ERROR = 'ERROR',
}

export interface AlexaApiErrorOptions extends JovoErrorOptions {
  code: AlexaApiErrorCode;
}

export class AlexaApiError extends JovoError {
  constructor(options: AlexaApiErrorOptions) {
    super(options);
  }
}

export interface AlexaApiOptions extends AxiosRequestConfig {
  endpoint: string;
  path: string;
  permissionToken: string;
  method?: Method;
  data?: unknown;
}

/**
 * Parses options and sends a request to the specified API endpoint
 * @param options - API options
 */
export async function sendApiRequest<RESPONSE>(
  options: AlexaApiOptions,
): Promise<AxiosResponse<RESPONSE>> {
  const url: URL = new URL(options.path, options.endpoint);

  const config: AxiosRequestConfig = {
    url: url.href,
    data: options.data,
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${options.permissionToken}`,
    },
  };
  return await axios(config);
}
