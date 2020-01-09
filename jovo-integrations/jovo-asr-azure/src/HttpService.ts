import { ClientRequest, IncomingHttpHeaders, IncomingMessage } from 'http';
import * as https from 'https';

export interface RequestResult<T = {}> {
  data?: T;
  headers: IncomingHttpHeaders;
  status: number;
}

export class HttpService {
  static makeRequest<T = {}>(
    options: https.RequestOptions = {},
    data?: Buffer,
  ): Promise<RequestResult<T>> {
    return new Promise<RequestResult<T>>((resolve, reject) => {
      const req: ClientRequest = https.request(options, (res: IncomingMessage) => {
        let collectedData = '';

        res.on('data', (chunk) => {
          collectedData += chunk;
        });

        res.on('end', () => {
          try {
            const result: RequestResult<T> = {
              data: collectedData !== '' ? JSON.parse(collectedData) : {},
              headers: res.headers,
              status: res.statusCode!,
            };
            resolve(result);
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
