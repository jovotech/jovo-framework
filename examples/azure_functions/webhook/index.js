'use strict';
const { App } = require('../../../index');
const app = new App()

app.setHandler({
    'HelloIntent': function () {
        this.tell('halo')
    }
})

// const { Webhook } = require('../../../index');
// const port = process.env.PORT || 3000;
// Webhook.listen(port, () => {
//     console.log(`Example server listening on port ${port}!`);
// });
// Webhook.post('/webhook', (req, res) => {
//     app.handleWebhook(req, res);
// });

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    app.handleFunction(context, req);
};