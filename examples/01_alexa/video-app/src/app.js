const {App} = require('jovo-framework/dist/src/index');
const {Alexa} = require('jovo-integrations/jovo-platform-alexa/dist/src/index');
const { JovoDebugger } = require('jovo-integrations/jovo-plugin-debugger/dist/src/index');

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
        this.$alexaSkill.$user.

        this.$alexaSkill.showVideo('https://url.to.video', 'Any Title', 'Any Subtitle').tell('Hallo');
    }
});

module.exports.app = app;
