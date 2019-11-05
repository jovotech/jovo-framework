import * as https from 'https';
import { BASE_URL, HTTPS, IdentityData } from '..';

export abstract class Message {
  protected constructor(readonly recipient: IdentityData) {}

  send(pageAccessToken: string): Promise<any> {
    return HTTPS.makeRequest(
      this.getUrl(pageAccessToken),
      this.getOptions(),
      this.getContentAsBuffer(),
    );
  }

  protected getUrl(pageAccessToken: string): string {
    return `${BASE_URL}/messages?access_token=${pageAccessToken}`;
  }

  protected getOptions(): https.RequestOptions {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  protected getContentAsBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this));
  }
}
