"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const { app } = require('./app.js');
if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.PORT || 3000;
    jovo_framework_1.Webhook.jovoApp = app;
    jovo_framework_1.Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}!`);
    });
    jovo_framework_1.Webhook.post('/webhook', async (req, res) => {
        await app.handle(new jovo_framework_1.ExpressJS(req, res));
    });
}
exports.handler = async (event, context, callback) => {
    await app.handle(new jovo_framework_1.Lambda(event, context, callback));
};
//# sourceMappingURL=index.js.map