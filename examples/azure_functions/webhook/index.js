'use strict';
const {App} = require('../../../index');
const app = new App();

app.setHandler({
    'HelloIntent': function() {
        this.tell('halo');
    },
});


module.exports = function(context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    app.handleFunction(context, req);
};

