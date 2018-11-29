const {App, Alexa, GoogleAssistant} = require('jovo-framework');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa()
);


const handlers = {
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },
};

const alexaHandlers = {

    'HelloWorldIntent': function() {
        this.tell('Hello Alexa User');
    },
};

const googleActionHandlers = {

    'HelloWorldIntent': function() {
        this.tell('Hello Google User');
    },
};

app.setHandler(handlers);
app.setAlexaHandler(alexaHandlers);
app.setGoogleActionHandler(googleActionHandlers);

module.exports.app = app;
