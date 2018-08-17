'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);

const song = 'https://s3.amazonaws.com/jovo-songs/song1.mp3';

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('PlayIntent');
    },

    'PlayIntent': function() {
        this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0)
            .play(song)
            .tell('Playing');
    },

    'PauseIntent': function() {
        this.alexaSkill().audioPlayer().stop();

        // Save offset to database
        this.user().data.offset = this.alexaSkill().audioPlayer().getOffsetInMilliseconds();

        this.tell('Paused!');
    },

    'ResumeIntent': function() {
        this.alexaSkill().audioPlayer().setOffsetInMilliseconds(this.user().data.offset)
            .play(song)
            .tell('Resuming!');
    },

    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted': function() {
            console.log('AudioPlayer.PlaybackStarted');

            this.endSession();
        },

        'AudioPlayer.PlaybackNearlyFinished': function() {
            console.log('AudioPlayer.PlaybackNearlyFinished');

            this.endSession();
        },

        'AudioPlayer.PlaybackFinished': function() {
            console.log('AudioPlayer.PlaybackFinished');
            this.alexaSkill().audioPlayer().stop();
            this.endSession();
        },

        'AudioPlayer.PlaybackStopped': function() {
            console.log('AudioPlayer.PlaybackStopped');
            
            /*eslint-disable */
            /**
             * is needed when user triggers PauseCommandIssued on devices with screen
             * @link https://developer.amazon.com/docs/custom-skills/playback-controller-interface-reference.html#requests // eslint-disable-line no-use-before-define
             */
            this.user().data.offset = this.alexaSkill().audioPlayer().getOffsetInMilliseconds();

            this.endSession();
        },

    },
    'PLAYBACKCONTROLLER': {
        'PlaybackController.PlayCommandIssued': function () {
            console.log('PlaybackController.PlayCommandIssued');
            this.alexaSkill().audioPlayer().setOffsetInMilliseconds(this.user().data.offset)
            .play(song);
        },

        'PlaybackController.NextCommandIssued': function () {
            console.log('PlaybackController.NextCommandIssued');
        },

        'PlaybackController.PreviousCommandIssued': function () {
            console.log('PlaybackController.PreviousCommandIssued');
        },

        'PlaybackController.PauseCommandIssued': function () {
            console.log('PlaybackController.PauseCommandIssued');
        }
    },
});

module.exports.app = app;

