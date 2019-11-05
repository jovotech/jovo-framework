import { ClientRequest, IncomingMessage } from 'http';
import * as https from 'https';

export class HTTPS {
  static makeRequest<T = {}>(
    url: string,
    options: https.RequestOptions = {},
    data?: Buffer,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const req: ClientRequest = https.request(url, options, (res: IncomingMessage) => {
        let collectedData = '';

        res.on('data', (chunk) => {
          collectedData += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(collectedData));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      if (data) {
        req.end(data);
      } else {
        req.end();
      }
    });
  }
}
