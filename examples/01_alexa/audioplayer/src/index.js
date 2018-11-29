'use strict';

const {
    webhook,
    ExpressJS,
    Lambda
} = require('jovo-framework');

const {app} = require('./app/app.js');

if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.PORT || 3000;

    webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}!`);
    });

    webhook.post('/webhook', async (req, res) => {
        await app.handle(new ExpressJS(req, res));
    });
}

// AWS Lambda
exports.handler = async (event, context, callback) => {
    await app.handle(new Lambda(event, context, callback));
};
