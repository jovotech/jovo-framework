'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        // app.toIntent('CatchAllIntent');
    },

    'CatchAllIntent': function(catchAll) {
        this.tell(catchAll.value);
    },
});

module.exports.app = app;

