import type { Request, Response, NextFunction } from 'express';
import { BaseApp } from 'jovo-core';
import { ExpressJS } from 'jovo-framework';

export const expressJsMiddleware = (app: BaseApp) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (
      req.originalUrl.endsWith('/webhook/session?') ||
      req.originalUrl.endsWith('/webhook/message?') ||
      req.originalUrl.endsWith('/webhook/terminated?') ||
      req.originalUrl.endsWith('/webhook/inactivity?')
    ) {
      await app.handle(new ExpressJS(req, res));
    } else {
      next();
    }
  };
};
