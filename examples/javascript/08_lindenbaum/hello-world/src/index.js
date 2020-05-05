'use strict';
const {
    Webhook,
    ExpressJS,
    Lambda
} = require('jovo-framework');

const { app } = require('./app.js');

const lindenbaumMiddleware = (app) => {
    return async (req, res, next) => {
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

if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.JOVO_PORT || 3000;
    Webhook.jovoApp = app;
    Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}!`);
    });

    Webhook.post('/webhook', async (req, res) => {
        console.log('/webhook');
        await app.handle(new ExpressJS(req, res));
    });
}

// AWS Lambda
exports.handler = async (event, context, callback) => {
    await app.handle(new Lambda(event, context, callback));
};
