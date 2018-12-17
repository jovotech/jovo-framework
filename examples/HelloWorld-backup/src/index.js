'use strict';

const {app} = require('./app/app.js');
const {Webhook, ExpressWrapper, LambdaWrapper} = require('jovo-framework');

if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.PORT || 3000;

    Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}!`);
    });
    Webhook.post('/webhook', async (req, res) => {
        // console.log(req.body);
        app.handle(new ExpressWrapper(req, res));
    });
}

// AWS Lambda
exports.handler = async (event, context, callback) => {
    await app.handle(new LambdaWrapper(event, context, callback));
};
