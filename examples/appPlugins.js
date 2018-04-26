'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App, Plugin} = require('jovo-framework');

const config = {
    // logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

class CustomLogging extends Plugin {
    constructor(options) {
        super(options);
    }
    init() {
        this.app.on('request', (jovo) => {
            console.log();
            console.log(`Request-Type: ${jovo.getPlatform().getRequestType()}`);
        });
        this.app.on('toIntent', (jovo, intent) => {
            console.log(`toIntent -> ${intent} `);
        });
        this.app.on('tell', (jovo, speech) => {
            console.log(`tell -> ${speech} `);
        });
    }

}
app.register('CustomLogging', new CustomLogging());

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

