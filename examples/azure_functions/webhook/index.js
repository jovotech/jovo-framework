'use strict';
const {App} = require('../../../index');

const config = {
    // Local file database persistence shouldn't be used by Azure Functions,
    // so we set the following property to disable persistence.
    // In production you should either not use persistence or switch to a different database provider.
    saveUserOnResponseEnabled: false
};

const app = new App(config);

app.setHandler({
    'HelloIntent': function() {
        this.tell('halo');
    },
});


module.exports = function(context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    app.handleFunction(context, req);
    // context.done is called by the Jovo Framework so no need to do it here
};

