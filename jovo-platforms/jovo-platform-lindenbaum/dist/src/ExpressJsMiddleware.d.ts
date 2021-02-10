import type { Request, Response, NextFunction } from 'express';
import { BaseApp } from 'jovo-core';
export declare const expressJsMiddleware: (app: BaseApp) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: Response<any>, next: NextFunction) => Promise<void>;
