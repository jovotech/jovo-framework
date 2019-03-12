'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');

const app = new App();

app.use(
    new GoogleAssistant(),
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.ask('Say "I need t-shirts" to trigger the slot filling intent!');
    },

    TShirtIntent() {
        if (!this.$inputs.color.value) {
            this.ask('Provide a color please!');
        } else if (!this.$inputs.number.value) {
            this.ask('Provide a number please');
        } else {
            this.ask(`So you want to buy ${this.$inputs.number.value} ${this.$inputs.color.value} t-shirts!`);
        }
    }
});

module.exports.app = app;
