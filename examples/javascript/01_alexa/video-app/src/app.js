const {App} = require('jovo-framework');
const {Alexa} = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),

);


app.setHandler({

    async LAUNCH() {
       return this.toIntent('StartVideoIntent');
    },
    async StartVideoIntent() {
        this.$alexaSkill.showVideo('https://url.to.video', 'Any Title', 'Any Subtitle').tell('Hallo');
    }
});

module.exports.app = app;
