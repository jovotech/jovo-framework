import { ExpressJS, Lambda, Webhook, App } from 'jovo-framework';
import { app } from './app';

import type { Request, Response, NextFunction } from 'express';

// ------------------------------------------------------------------
// HOST CONFIGURATION
// ------------------------------------------------------------------

const lindenbaumMiddleware = (app: App) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.originalUrl.startsWith('/webhook/session') ||
            req.originalUrl.startsWith('/webhook/message') ||
            req.originalUrl.startsWith('/webhook/terminated')) {
            await app.handle(new ExpressJS(req, res));
        } else {
            next();
        }
    };
};
Webhook.use(lindenbaumMiddleware(app));

// ExpressJS (Jovo Webhook)
if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.JOVO_PORT || 3000;
    Webhook.jovoApp = app;

    Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}.`);
    });

    Webhook.post('/webhook', async (req: Express.Request, res: Express.Response) => {
        console.log('/webhook');
        await app.handle(new ExpressJS(req, res));
    });
}

// AWS Lambda
export const handler = async (event: any, context: any, callback: Function) => {
    await app.handle(new Lambda(event, context, callback));
};
