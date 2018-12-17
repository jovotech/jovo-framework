const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const _ = require('lodash');

const app = new App();
Util.consoleLog();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    // new JovoDebugger(),
    new FileDb(),
);

const BUTTON_COLORS = [
    'e6194b', // red
    '3cb44b', // green
    'ffe119', // yellow
    '0082c8', // blue
];

app.setHandler({
    LAUNCH() {
        console.log('LAUNCH()');

        // For this project, we'll focus only on 'button up' events, because
        // 'button down' events offer very little information over their coupled 'button up' events

        // To trigger a 'buttonDownEvent', we first need to initialize and configure
        // a corresponding recognizer:

        const buttonDownRecognizer = this.$alexaSkill.$gameEngine
            .getPatternRecognizerBuilder('buttonDownRecognizer')
            .anchorEnd()
            .fuzzy(false)
            .pattern(
                [
                    {
                        'action': 'down',
                    },
                ]
            );

        // Now we're initializing the 'button down' event, using the recognizer we just created
        const buttonDownEvent = this.$alexaSkill.$gameEngine
            .getEventsBuilder('buttonDownEvent')
            .meets(['buttonDownRecognizer'])
            .reportsMatches()
            .shouldEndInputHandler(false)
            .build();


        // We also need to configure the timeout event, but it doesn't need a custom recognizer
        const timeoutEvent = this.$alexaSkill.$gameEngine
            .getEventsBuilder('timeoutEvent')
            .meets(['timed out'])
            .reportsNothing()
            .shouldEndInputHandler(true)
            .build();


        // Proxies are placeholder names for buttons that are not yet registered.
        const proxies = ['btn1', 'btn2', 'btn3', 'btn4']; // ???
        // const proxies = [];

        // This is how long we want to listen for events from the gadget API
        const timeout = 30000;

        // Now we're registering our events and the recognizer at the game engine
        // and set timeout and proxies
        this.$alexaSkill.$gameEngine
            .setEvents([buttonDownEvent, timeoutEvent])
            .setRecognizers([buttonDownRecognizer])
            .startInputHandler(timeout, proxies);

        // These user data are for keeping track of which buttons we already know about
        this.$user.$data.buttonCount = 0;
        this.$user.$data.knownButtons = [];

        // Input handler events can be time-delayed, but they are signed with the ID of the
        // request that started their input handler directive. So we're remembering the current
        // request ID and compare them with the gadget API requests we will receive.
        this.$user.$data.currentInputHandlerId = this.$request.getRequestId();

        // Our Game Engine is not fully configured and ready to use - But we didn't define any
        // animations for our buttons yet. For this, we need the Gadget Controller.
        // const gadgetControllerIdle = this.$alexaSkill.gadgetController();

        // This is the light for then the button is idle, with pulsating soft white light
        this.$alexaSkill.gadgetController()
            .setNoneTriggerEvent()
            .setAnimations(
                [
                    {
                        'repeat': 20,
                        'targetLights': ['1'],
                        'sequence': [
                            {
                                'durationMs': 500,
                                'color': '111111',
                                'blend': true,
                            },
                            {
                                'durationMs': 500,
                                'color': '000000',
                                'blend': true,
                            },
                        ],
                    },
                ]
            )
            .setLight(
                [], // In case of an empty button ID array, all buttons are selected
                0, // No time offset between 'event' and animation
                // [] // Unused parameter
            );

        // // These are the animations for the moment after when the button is actually released
        // // To keep things simple, all buttons use the same animation
        this.$alexaSkill.gadgetController()
            .setTriggerEvent('buttonUp')
            .setAnimations(
                [
                    {
                        'repeat': 1,
                        'targetLights': ['1'],
                        'sequence': [
                            {
                                'durationMs': 1000,
                                'color': 'ffffff',
                                'blend': true,
                            },
                        ],
                    },
                ]
            )
            .setLight(
                [], // In case of an empty button ID array, all buttons are selected
                0, // No time offset between 'event' and animation
                // [] // Unused parameter
            );

        // // We also need to define a 'dummy' animation for when the button is pressed down.
        // // If we don't define one here, we get a blue flash as a default
        this.$alexaSkill.gadgetController()
            .setTriggerEvent('buttonDown')
            .setAnimations(
                [
                    {
                        'repeat': 1,
                        'targetLights': ['1'],
                        'sequence': [
                            {
                                'durationMs': 1000,
                                'color': 'ffffff',
                                'blend': true,
                            },
                        ],
                    },
                ]
            )
            .setLight(
                [], // In case of an empty button ID array, all buttons are selected
                0, // No time offset between 'event' and animation
                [] // Unused parameter
            );
        // Now we're setting up a little tune fom the ASK sound library and a text,
        // and send the response
        this.$speech
            .addAudio('https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01.mp3')
            .addText('Hello there! Show me your sweet buttons!');

        this.$alexaSkill.$gameEngine.respond(this.$speech);
    },
    ON_GAME_ENGINE_INPUT_HANDLER_EVENT() {
        console.log('ON_GAME_ENGINE_INPUT_HANDLER_EVENT()');
        // This will be one of our configured events 'buttonDownEvent' or 'timeout'
        // In theory, there can be more than one event in one input handler event,
        // but in practice you'll be fine focussing on the first one
        const inputEvent = this.$request.request.events[0];
        const eventName = inputEvent.name;
        console.log(`Event name: ${eventName}`);

        if (eventName === 'timeoutEvent') {
            this.$speech
                .addText('This was it. Thanks!')
                .addAudio('https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_outro_01.mp3');
            this.tell(this.$speech);
        } else if (eventName === 'buttonDownEvent') {
            console.log(`Button was pushed down!`);

            // Here we check whether this gadget API request ID matches the one that
            // started the input handler. In fully developed Button Skill, mismatches
            // should be ignored
            const originatingRequestId = this.$request.request.originatingRequestId;
            console.log(`Matching request ID? ${
            this.$user.$data.currentInputHandlerId === originatingRequestId
                }`);

            // Now we're checking if this button is already known
            const buttonId = inputEvent.inputEvents[0].gadgetId;
            console.log(`Button ID: ${buttonId}`);
            let knownButtons = this.$user.$data.knownButtons;
            console.log(`Known buttons: ${
                JSON.stringify(knownButtons, null, 4)
                }`);

            if (_.includes(knownButtons, buttonId)) {
                // The button is already known, so we respond only with a neutral sound
                this.speech.addAudio(
                    'https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_02.mp3'
                );
            } else {
                // This is a new button, so we add a greeting and change its animation
                knownButtons.push(buttonId);
                this.$user.$data.knownButtons = knownButtons;
                // In our case, the button number is one-indexed
                const buttonNumber = knownButtons.length;
                this.$user.$data.buttonCount = knownButtons.length;
                this.$speech
                    .addAudio(
                        `https://s3.amazonaws.com/ask-soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_player${buttonNumber}_01.mp3` // eslint-disable-line
                    )
                    .addText(`Welcome, button ${buttonNumber}!`);

                this.$alexaSkill.$gadgetController
                    .setNoneTriggerEvent()
                    .setAnimations(
                        [
                            {
                                'repeat': 20,
                                'targetLights': ['1'],
                                'sequence': [
                                    {
                                        'durationMs': 500,
                                        'color': BUTTON_COLORS[buttonNumber - 1],
                                        'blend': true,
                                    },
                                    {
                                        'durationMs': 500,
                                        'color': '000000',
                                        'blend': true,
                                    },
                                ],
                            },
                        ]
                    )
                    .setLight(
                        [buttonId],
                        0,
                        []
                    );
            }

            this.$alexaSkill.$gadgetController.respond(
                this.$speech
            );
        }
    },

    buttonRequest() {
        this.ask('Did you just push a button?!');
    },

    Unhandled() {
        this.tell('See you next time!');
    },

});


module.exports.app = app;
