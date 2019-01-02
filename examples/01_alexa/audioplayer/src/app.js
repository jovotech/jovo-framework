const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

const SONG = 'https://s3.amazonaws.com/jovo-songs/song1.mp3';


app.use(
    new Alexa(),
    new JovoDebugger()
);


app.setHandler({
    LAUNCH() {
        this.toIntent('PlayIntent');
    },
    PlayIntent() {
        this.$alexaSkill.audioPlayer().setOffsetInMilliseconds(0)
            .play(SONG, 'token')
            .tell('Hello World!');
    },

    PauseIntent() {
        this.$alexaSkill.audioPlayer().stop();

        // Save offset to database
        this.$user.data.offset = this.$alexaSkill.audioPlayer().getOffsetInMilliseconds();

        this.tell('Paused!');
    },

    ResumeIntent() {
        this.$alexaSkill.audioPlayer().setOffsetInMilliseconds(this.user().data.offset)
            .play(SONG, 'token')
            .tell('Resuming!');
    },


    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted'() {
            console.log('AudioPlayer.PlaybackStarted');
        },

        'AudioPlayer.PlaybackNearlyFinished'() {
            console.log('AudioPlayer.PlaybackNearlyFinished');
        },

        'AudioPlayer.PlaybackFinished'() {
            console.log('AudioPlayer.PlaybackFinished');
            this.$alexaSkill.audioPlayer().stop();
        },

        'AudioPlayer.PlaybackStopped'() {
            console.log('AudioPlayer.PlaybackStopped');
        },

    },
});


module.exports.app = app;
