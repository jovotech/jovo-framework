'use strict';

const _ = require('lodash');
const {Webhook, App} = require('../index');

let mod = _.replace(process.argv[2], /\\/g, '/');
const debugapp = require(mod).app;
const app = new App(debugapp.getConfig());

const port = process.env.PORT || 3000;
Webhook.listen(port, () => {
    console.log(`Example server listening on port ${port}!`);
});
Webhook.post('/webhook', (req, res) => {
    app.handleWebhook(req, res);
});
