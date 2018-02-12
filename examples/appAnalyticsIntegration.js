'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: false,
    analytics: {
        services: {
            DashbotAlexa: {
                key: '6Idg1n3pCbk4bMh4XYubQVx5ckjVtuHctMND4sMM',
            },
        },
    },
};

const app = new App(config);

// app.addVoiceLabsAlexa('23b55e80-3e3f-11a7-2167-0e2486876586');
// app.addVoiceLabsGoogleAction('228f1d00-5764-11a7-023a-0e2486876586');
// app.addDashbotGoogleAction('1T3ZonKcbNzLv6eFLBwI9Fv8JAU5SBVorCCvvD1D');
// app.addDashbotAlexa('6Idg1n3pCbk4bMh4XYubQVx5ckjVtuHctMND4sMM');
// app.addBespokenAnalytics('Bespoken secret key');
// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.tell('Hello World!');
    },
});

module.exports.app = app;

// quick testing
// node index.js appHelloWorld.js --launch
// node index.js appHelloWorld.js --intent MyNameIsIntent --parameter name=Alex

