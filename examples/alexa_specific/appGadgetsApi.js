'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
    // requestLogging: true,
    // db: {
    //     type: 'file',
    //     localDbFilename: __dirname + '/db/db.json',
    // },
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================
app.setHandler({

    'LAUNCH': function() {
        // this.alexaSkill().audioPlayer().startOver('https://www.swetlow.de/uneasy.mp3', 'asd').tell('los');
        // this.alexaSkill().audioPlayer().startOver('https://www.jovo.tech/audio/E9EPGKAA-lionking.mp3', 'token').tell('Start');
        // this.ask('Hallo');
        // this.user().data.playing = false;
        // this.alexaSkill().addDirective({
        //     'type': 'GameEngine.StartInputHandler',
        //     'timeout': 200000, // In milliseconds.
        //     'recognizers': {  // Defines which Button Presses your Skill would like to receive as events.
        //         'button_down_recognizer': {
        //             'type': 'match',
        //             'fuzzy': false,
        //             'anchor': 'end',
        //             'pattern': [{
        //                 'action': 'down',
        //             }],
        //         },
        //         // 'button_up_recognizer': {
        //         //     'type': 'match',
        //         //     'fuzzy': false,
        //         //     'anchor': 'end',
        //         //     'pattern': [{
        //         //         'action': 'up',
        //         //     }],
        //         // },
        //     },
        //     'events': {  // These events will be sent to your Skill in a request.
        //         'button_down_event': {
        //             'meets': ['button_down_recognizer'],
        //             'reports': 'matches',
        //             'shouldEndInputHandler': false,
        //         },
        //         // 'button_up_event': {
        //         //     'meets': ['button_up_recognizer'],
        //         //     'reports': 'matches',
        //         //     'shouldEndInputHandler': false,
        //         // },
        //         'timeout': {
        //             'meets': ['timed out'],
        //             'reports': 'history',
        //             'shouldEndInputHandler': true,
        //         },
        //     },
        // });
        //
        this.alexaSkill().addDirective({
            'type': 'GadgetController.SetLight',
            'version': 1,
            'targetGadgets': [],
            'parameters': {
                'animations': [{
                    'repeat': 1,
                    'targetLights': ['1'],
                    'sequence': [{
                        'durationMs': 50,
                        'color': '000000',
                        'blend': false,
                    }],
                }],
                'triggerEvent': 'buttonDown',
                'triggerEventTimeMs': 0,
            },
        });
        this.tell('bla');
    },
    'AMAZON.CancelIntent:': function() {
        this.alexaSkill().audioPlayer().stop().endSession();
    },
    'AMAZON.PauseIntent:': function() {
        this.alexaSkill().audioPlayer().stop().endSession();
    },
    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted': function() {
            console.log('AudioPlayer.PlaybackStarted');
console.log('Started: ' + new Date(this.getTimestamp()));
            this.user().data.started = new Date(this.getTimestamp()).getTime();
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
            this.endSession();
        },

    },
    '(request.type=GameEngine.InputHandlerEvent)': function() {
        // this.tell('yo geil');

        // console.log(JSON.stringify(this.alexaSkill().getRequest().request.events, null, '\t'));
        if (this.alexaSkill().getRequest().request.events[0].name === 'button_down_event'
            ) {
            console.log(this.alexaSkill().audioPlayer().getPlayerActivity());
            if (this.user().data.playing === false) {
                console.log('Before started: ' + new Date(this.getTimestamp()).getTime());
                this.user().data.playing = true;
                this.alexaSkill().audioPlayer().startOver('https://www.swetlow.de/Haensel-und-Gretel.mp3', 'token').tell('Start');
            } else {
                if (!this.user().data.pressed) {
                    this.user().data.pressed = [];
                }
                console.log('Pressed: ' + this.getTimestamp());

                this.user().data.pressed.push(new Date(this.getTimestamp()).getTime());



                this.alexaSkill().addDirective({
                    'type': 'GadgetController.SetLight',
                    'version': 1,
                    'targetGadgets': [],
                    'parameters': {
                        'animations': [{
                            'repeat': 1,
                            'targetLights': ['1'],
                            'sequence': [{
                                'durationMs': 150,
                                'color': 'FF0000',
                                'blend': false,
                            }],
                        }],
                        'triggerEvent': 'none',
                        'triggerEventTimeMs': 0,
                    },
                });
                this.endSession();
                // this.alexaSkill().audioPlayer().stop().endSession();
            }
        }
    },
    'HelloWorldIntent': function() {
        this.ask('Hello World! What is your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name.value + ', nice to meet you!');
    },
    'AMAZON.PauseIntent': function() {
        this.alexaSkill().audioPlayer().stop().endSession();
    },
});

module.exports.app = app;

// quick testing
// node index.js appHelloWorld.js --launch
// node index.js appHelloWorld.js --intent MyNameIsIntent --parameter name=Alex

