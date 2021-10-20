import { Headers, QueryParams, Server } from '@jovotech/framework';
import type { Request, Response } from 'express';
import { AnyObject } from '@jovotech/common';

export interface ErrorResponse {
  code: number;
  msg: string;
  stack?: string;
}

export class ExpressJs extends Server {
  req: Request;
  res: Response;

  constructor(req: Request, res: Response) {
    super();
    this.req = req;
    this.res = res;
  }

  fail(error: Error): void {
    if (!this.res.headersSent) {
      const responseObj: ErrorResponse = {
        code: 500,
        msg: error.message,
      };

      if (process.env.NODE_ENV === 'production') {
        responseObj.stack = error.stack;
      }
      this.res.status(responseObj.code).json(responseObj);
    }
  }

  getQueryParams(): QueryParams {
    return (this.req.query as QueryParams) || {};
  }

  getRequestObject(): AnyObject {
    return this.req.body;
  }

  getRequestHeaders(): Headers {
    return this.req.headers || {};
  }

  hasWriteFileAccess(): boolean {
    return true;
  }

  setResponse(response: unknown): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.res.headersSent) {
        this.res.json(response);
      }
      resolve();
    });
  }

  // eslint-disable-next-line
  setResponseHeaders(header: Record<string, string>): void {
    Object.keys(header).forEach((key) => {
      this.res.setHeader(key, header[key]);
    });
  }
}
