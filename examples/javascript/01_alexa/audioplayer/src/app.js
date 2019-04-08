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
        return this.toIntent('PlayIntent');
    },
    PlayIntent() {
        this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(0)
            .play(SONG, 'token')
            .tell('Hello World!');
    },

    PauseIntent() {
        this.$alexaSkill.$audioPlayer.stop();

        // Save offset to database
        this.$user.$data.offset = this.$alexaSkill.$audioPlayer.getOffsetInMilliseconds();

        this.tell('Paused!');
    },

    ResumeIntent() {
        this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(this.$user.$data.offset)
            .play(SONG, 'token')
            .tell('Resuming!');
    },


    AUDIOPLAYER: {
        'AlexaSkill.PlaybackStarted'() {
            console.log('AudioPlayer.PlaybackStarted');
        },

        'AlexaSkill.PlaybackNearlyFinished'() {
            console.log('AudioPlayer.PlaybackNearlyFinished');
        },

        'AlexaSkill.PlaybackFinished'() {
            console.log('AudioPlayer.PlaybackFinished');
            this.$alexaSkill.$audioPlayer.stop();
        },

        'AlexaSkill.PlaybackStopped'() {
            console.log('AudioPlayer.PlaybackStopped');
        },

    },
    PLAYBACKCONTROLLER: {
        'PlayCommandIssued'() {
            console.log('PlaybackController.PlayCommandIssued');
            this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(this.$user.$data.offset)
                .play(SONG, 'token');
        },
        'NextCommandIssued'() {
            console.log('PlaybackController.NextCommandIssued');
            this.$alexaSkill.$audioPlayer
                .startOver(SONG, 'token');
        },
        'PreviousCommandIssued'() {
            console.log('PlaybackController.PreviousCommandIssued');
            this.$alexaSkill.$audioPlayer
                .startOver(SONG, 'token');
        },

    },
});


module.exports.app = app;
