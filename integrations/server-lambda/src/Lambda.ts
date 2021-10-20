import { Headers, QueryParams, Server } from '@jovotech/framework';
import type { APIGatewayEvent, Callback, Context } from 'aws-lambda';
import type { APIGatewayProxyEventHeaders } from 'aws-lambda/trigger/api-gateway-proxy';
import { AnyObject, UnknownObject } from '@jovotech/common';

export class Lambda extends Server {
  isApiGateway = false;
  headers: APIGatewayProxyEventHeaders = {};
  requestPayload: AnyObject;

  responseHeaders: Headers = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  constructor(
    readonly event: APIGatewayEvent,
    readonly context: Context,
    readonly callback: Callback,
  ) {
    super();
    if (typeof event.body !== 'undefined') {
      this.isApiGateway = true;
      this.headers = event.headers;
      this.requestPayload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } else {
      this.requestPayload = event;
    }
  }

  fail(error: Error): void {
    const responseData: UnknownObject = {
      code: 500,
      msg: error.message,
    };

    if (process.env.NODE_ENV === 'production') {
      responseData.stack = error.stack;
    }

    if (this.isApiGateway) {
      this.callback(error, {
        body: JSON.stringify(responseData),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        isBase64Encoded: false,
        statusCode: 500,
      });
    } else {
      this.callback(error, responseData);
    }
  }

  getQueryParams(): QueryParams {
    return this.event.queryStringParameters || {};
  }

  getRequestObject(): AnyObject {
    return this.requestPayload;
  }

  getRequestHeaders(): Headers {
    return this.headers || {};
  }

  hasWriteFileAccess(): boolean {
    return false;
  }

  setResponse(response: unknown): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.isApiGateway) {
        this.callback(null, {
          body: typeof response === 'object' ? JSON.stringify(response) : response,
          headers: this.responseHeaders,
          isBase64Encoded: false,
          statusCode: 200,
        });
      } else {
        this.callback(null, response);
      }
      resolve();
    });
  }

  setResponseHeaders(header: Record<string, string>): void {
    this.responseHeaders = header;
  }
}
