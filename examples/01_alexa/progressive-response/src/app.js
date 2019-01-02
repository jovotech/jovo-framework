const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const moment = require('moment-timezone');

const app = new App();

app.use(
    new Alexa()
);


app.setHandler({


    async LAUNCH() {
        // return this.toIntent('ProgressiveResponseWithCallback');
        return this.toIntent('ProgressiveResponseWithPromise');


    },
    async ProgressiveResponseWithCallback() {
        this.$alexaSkill.progressiveResponse('Processing your request', () => {
            setTimeout( () => {
                this.alexaSkill().progressiveResponse('Still processing');
            }, 1500);
        });
        await dummyApiCall(2000);

        this.tell('Text after API call');
    },
    async ProgressiveResponseWithPromise() {
        this.$alexaSkill.progressiveResponse('Processing')
            .then(() => this.$alexaSkill.progressiveResponse('Still processing'));
        await dummyApiCall(2000);

        this.tell('Text after API call');
    },
});


function dummyApiCall(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

module.exports.app = app;
