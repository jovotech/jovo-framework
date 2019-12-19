import { ApiError } from './ApiError';
import { AxiosRequestConfig, HttpService, Method, SpeechBuilder } from 'jovo-core';
import { AlexaAPIResponse } from './AlexaAPIResponse';
import { AuthorizationResponse } from '../modules/ProactiveEvent';

export interface ApiCallOptions {
  endpoint: string;
  method?: Method;
  path: string;
  permissionToken?: string;
  json?: any; // tslint:disable-line
}

export class AlexaAPI {
  /**
   *
   * @param {ApiCallOptions} options
   * @returns {Promise<any>}
   */
  static async apiCall(options: ApiCallOptions) {
    const url = options.endpoint + options.path;
    const config: AxiosRequestConfig = {
      data: options.json,
      url,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.permissionToken}`,
      },
      validateStatus: (status: number) => {
        return true;
      }
    };

    const response = await HttpService.request(config);
    if (response.status !== 204 && response.data) {
      return new AlexaAPIResponse(response.status, response.data);
    }
    return new AlexaAPIResponse(response.status, {});
  }

  static async progressiveResponse(
    speech: string | SpeechBuilder,
    requestId: string,
    apiEndPoint: string,
    apiAccessToken: string,
  ) {
    const outputSpeech: string = speech.toString();

    const data = {
      header: {
        requestId,
      },
      directive: {
        type: 'VoicePlayer.Speak',
        speech: SpeechBuilder.toSSML(outputSpeech),
      },
    };

    const url = `${apiEndPoint}/v1/directives`;
    const config: AxiosRequestConfig = {
      data,
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiAccessToken}`,
      },
    };

    try {
      await HttpService.request(config);
      return;
    } catch (e) {
      throw new ApiError(e.message);
    }
  }

  /**
   * TODO
   * Proactive Events Authorization API call
   */
  static async proactiveEventAuthorization(
    clientId: string,
    clientSecret: string,
  ): Promise<AuthorizationResponse> {
    const url = `https://api.amazon.com/auth/O2/token`;

    const data = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=alexa::proactive_events`;

    const config: AxiosRequestConfig = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    };

    try {
      const response = await HttpService.request(config);
      return response.data;
    } catch (e) {
      throw new ApiError(e.message);
    }
  }
}
