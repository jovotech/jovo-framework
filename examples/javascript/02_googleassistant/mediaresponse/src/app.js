const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger()
);
const song = 'https://s3.amazonaws.com/jovo-songs/song1.mp3';

app.setHandler({
    async LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.$googleAction.mediaResponse().play(song, 'title', 'subtitle');
        this.$googleAction.showSuggestionChips(['Stop', 'Pause']);
        this.ask('How do you like my new song?');
    },
    AUDIOPLAYER: {
        'GoogleAction.Finished'() {
            this.toIntent('HelloWorldIntent');
        },
    },
});




module.exports.app = app;
