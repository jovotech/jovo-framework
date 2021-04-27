import { Headers, QueryParams, Server } from '@jovotech/framework';
import type { APIGatewayEvent, Callback, Context } from 'aws-lambda';
import type { APIGatewayProxyEventHeaders } from 'aws-lambda/trigger/api-gateway-proxy';

export class Lambda extends Server {
  event: APIGatewayEvent;
  context: Context;
  callback: Callback;

  isApiGateway = false;
  headers: APIGatewayProxyEventHeaders = {};
  requestPayload: Record<string, string> | unknown;

  responseHeaders: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  constructor(event: APIGatewayEvent, context: Context, callback: Callback) {
    super();
    this.event = event;
    this.context = context;
    this.callback = callback;

    if (typeof event.body !== 'undefined') {
      this.isApiGateway = true;
      this.headers = event.headers;
      this.requestPayload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } else {
      this.requestPayload = event;
    }
  }

  fail(error: Error): void {
    //
  }

  getQueryParams(): QueryParams {
    return {};
  }

  getRequestObject(): Record<string, string> {
    return this.requestPayload as Record<string, string>;
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
