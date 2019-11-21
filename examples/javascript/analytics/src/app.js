
const { App, Util, BasicLogging } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { BotAnalyticsAlexa } = require('jovo-analytics-botanalytics');
const { GoogleAnalytics } = require('jovo-analytics-googleanalytics');

const app = new App();
app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    // new BotAnalyticsAlexa(),
    new GoogleAnalytics()
);

app.setHandler({
    async LAUNCH(jovo) {
        // await this.$user.load();
        return this.toIntent('HelloWorldIntent');
        // this.tell('Hello');
        // await this.$user.save();
    },
    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});


module.exports.app = app;
