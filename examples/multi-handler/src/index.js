'use strict';

const {
    Webhook,
    ExpressWrapper,
    LambdaWrapper
} = require('jovo-framework');

const {app} = require('./app/app.js');

if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.PORT || 3000;

    Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}!`);
    });
    
    Webhook.post('/webhook', async (req, res) => {
        await app.handle(new ExpressWrapper(req, res));
    });
}

// AWS Lambda
exports.handler = async (event, context, callback) => {
    await app.handle(new LambdaWrapper(event, context, callback));
};
