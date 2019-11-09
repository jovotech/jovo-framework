import * as https from 'https';
import { BASE_PATH, HOST, HTTPS, IdentityData } from '..';

export abstract class Message {
  protected constructor(readonly recipient: IdentityData) {}

  send(pageAccessToken: string): Promise<any> {
    return HTTPS.makeRequest(this.getOptions(pageAccessToken), this.getContentAsBuffer());
  }

  protected getPath(pageAccessToken: string): string {
    return `${BASE_PATH}/messages?access_token=${pageAccessToken}`;
  }

  protected getOptions(pageAccessToken: string): https.RequestOptions {
    return {
      hostname: HOST,
      method: 'POST',
      path: this.getPath(pageAccessToken),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  protected getContentAsBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this));
  }
}
