import { AxiosRequestConfig, AxiosResponse, HttpService } from 'jovo-core';
import { ApiVersion, BASE_URL, IdentityData, SendMessageResponse } from '..';

export abstract class Message {
  protected constructor(readonly recipient: IdentityData) {}

  send(pageAccessToken: string, version: ApiVersion): Promise<AxiosResponse<SendMessageResponse>> {
    return HttpService.request(this.getConfig(pageAccessToken, version));
  }

  protected getPath(pageAccessToken: string, version: ApiVersion): string {
    return `/${version}/me/messages?access_token=${pageAccessToken}`;
  }

  protected getConfig(pageAccessToken: string, version: ApiVersion): AxiosRequestConfig {
    const url = BASE_URL + this.getPath(pageAccessToken, version);
    return {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: this,
    };
  }
}
