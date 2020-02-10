import * as https from 'https';

import { ApiError } from './ApiError';
import { RequestOptions } from 'https';
import { AlexaApiResponse } from './AlexaApiResponse';

export interface AmazonPayApiRequestOptions {
  host?: AmazonPayApiHost;
  apiAccessToken?: string;
}

enum AmazonPayApiHost {
  EU = 'pay-api.amazon.eu',
  NA = 'pay-api.amazon.com',
  JP = 'pay-api.amazon.jp',
}

export interface BuyerIdResponse {
  buyerId: string;
}

export interface BuyerAddressRequestOptions extends AmazonPayApiRequestOptions {
  sandboxEmail?: string;
  sellerId: string;
  sandbox?: boolean;
}

export interface BuyerAddressResponse {
  addresses: BuyerAddress[];
}

export interface BuyerAddress {
  address: {
    addressLine1: string;
    city: string;
    countryCode: string;
    name: string;
    phone: string;
    postalCode: string;
    stateOrRegion: string;
  };
  addressType: string;
}

export class AmazonPayAPI {
  static async getBuyerId(options: AmazonPayApiRequestOptions): Promise<BuyerIdResponse> {
    const apiRequestOptions: RequestOptions = {
      port: 443,
      hostname: options.host,
      path: '/live/v1/buyer/id',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + options.apiAccessToken,
      },
    };

    try {
      const response: any = await AmazonPayAPI.apiCall(apiRequestOptions); // tslint:disable-line
      if (response.httpStatus !== 200) {
        const apiError = new ApiError(response.data.errorDescription, response.data.errorCode);
        return Promise.reject(apiError);
      }
      return Promise.resolve(response.data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async getBuyerAddress(options: BuyerAddressRequestOptions): Promise<BuyerAddressResponse> {
    const apiRequestOptions: RequestOptions = {
      port: 443,
      hostname: options.host,
      path: `/live/v1/buyer/addresses?sellerId=${options.sellerId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + options.apiAccessToken,
      },
    };

    if (options.sandbox) {
      apiRequestOptions.path = `/sandbox/v1/buyer/addresses?sellerId=${options.sellerId}`;
      apiRequestOptions.headers!['x-amz-pay-sandbox-email-id'] = options.sandboxEmail;
    }

    try {
      const response: any = await AmazonPayAPI.apiCall(apiRequestOptions); // tslint:disable-line
      if (response.httpStatus !== 200) {
        const apiError = new ApiError(response.data.errorDescription, response.data.errorCode);
        return Promise.reject(apiError);
      }
      return Promise.resolve(response.data);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  // tslint:disable-next-line
  static async apiCall(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = https
        .request(options, (res) => {
          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });
          res.on('end', () => {
            let parsedData;
            if (res.statusCode === 204) {
              // no content
              resolve(new AlexaApiResponse(res.statusCode, {}));
              return;
            }
            try {
              if (rawData.length > 0) {
                parsedData = JSON.parse(rawData);
                return resolve(new AlexaApiResponse(res.statusCode, parsedData));
              }
            } catch (e) {
              return reject(
                new ApiError(e.message || 'Something went wrong', e.code || ApiError.PARSE_ERROR),
              );
            }
            resolve(new AlexaApiResponse(res.statusCode, {}));
          });
        })
        .on('error', (e) => {
          reject(e);
        });
      req.end();
    });
  }

  /**
   * Maps the parsed Alexa API endpoint to the Amazon Pay API host.
   * There is a separate one for NA, EU (+ UK) and JP
   * @param {string} alexaApiEndpoint e.g. "https://api.amazonalexa.com"
   * @returns {string}
   */
  static mapAlexaApiEndpointToAmazonPayApiHost(alexaApiEndpoint: string) {
    switch (alexaApiEndpoint) {
      case 'https://api.eu.amazonalexa.com':
        return AmazonPayApiHost.EU;
      case 'https://api.fe.amazonalexa.com':
        return AmazonPayApiHost.JP;
      default:
        return AmazonPayApiHost.NA;
    }
  }
}
