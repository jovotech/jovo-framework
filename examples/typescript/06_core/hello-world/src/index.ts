
import { Webhook, ExpressJS, Lambda } from 'jovo-framework';

const {app} = require('./app.js');

if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.PORT || 3000;
    Webhook.jovoApp = app;
    Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}!`);
    });

    Webhook.post('/webhook', async (req: any, res: any) => { // tslint:disable-line
        await app.handle(new ExpressJS(req, res));
    });
}

// AWS Lambda
export const handler = async (event: any, context: any, callback: Function) => { // tslint:disable-line
    await app.handle(new Lambda(event, context, callback));
};
