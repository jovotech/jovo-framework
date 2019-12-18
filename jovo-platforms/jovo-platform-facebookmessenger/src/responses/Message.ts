import { AxiosRequestConfig, HttpService } from 'jovo-core';
import { BASE_PATH, BASE_URL, IdentityData } from '..';

export abstract class Message {
  protected constructor(readonly recipient: IdentityData) {}

  send(pageAccessToken: string): Promise<any> {
    return HttpService.request(this.getConfig(pageAccessToken));
  }

  protected getPath(pageAccessToken: string): string {
    return `${BASE_PATH}/messages?access_token=${pageAccessToken}`;
  }

  protected getConfig(pageAccessToken: string): AxiosRequestConfig {
    const url = BASE_URL + this.getPath(pageAccessToken);
    return {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: this,
      validateStatus: (status: number) => {
        return true;
      },
    };
  }
}
