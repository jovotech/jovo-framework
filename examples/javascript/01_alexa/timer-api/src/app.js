const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const app = new App();

app.use(
    new Alexa()
);


app.setHandler({
    async LAUNCH() {
        this
          .followUpState('AnswerState')
          .ask('Set a timer, show all timers or cancel all timers. What would you like to do?');
    },
    AnswerState: {
        async SetTimerIntent() {

            this.$alexaSkill.askForTimers();
            this.ask('May I set a timer?');

        },

        async AllTimersIntent() {
            const result = await this.$alexaSkill.$user.getAllTimers();
            this.$speech.addText(`You have ${result.totalCount} timer`);
            this.ask(this.$speech);
        },
        async CancelAllTimersIntent() {
            try {
                // await this.$alexaSkill!.$user.cancelTimer(id);
                await this.$alexaSkill.$user.cancelAllTimers();
                this.tell('I canceled all timers.');
            } catch(e) {
                this.tell('Something went wrong.');
            }
        },

    },

    async ON_PERMISSION() {
        const status = this.$alexaSkill.getPermissionStatus();

        if (this.$alexaSkill.hasPermissionAccepted()) {
            const timer = {
                timerLabel: 'pizza',
                creationBehavior: {
                    displayExperience: {
                        visibility: 'VISIBLE'
                    }
                },
                duration: "PT5M",
                triggeringBehavior: {
                    operation: {
                        type: 'NOTIFY_ONLY',
                    },
                    notificationConfig: {
                        playAudible: true,
                    },
                }
            };

            try {
                const result = await this.$alexaSkill.$user.setTimer(timer);

                this.$user.$data.pizzaTimerId = result.id;

                this.tell('10 minute pizza timer has been set.');
            } catch (e) {
                this.tell('Something went wrong.');
            }
        } else {
            this.tell('Something went wrong.');
        }

    },
});


module.exports.app = app;
