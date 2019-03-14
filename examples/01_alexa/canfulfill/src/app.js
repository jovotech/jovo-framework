'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    async LAUNCH() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    CAN_FULFILL_INTENT() {
        const knownSlots = ['name'] // other known slots
        let canFulfillOneOrMoreSlots = false;
        let canFulfillEverySlot = true;
        let canUnderstand;
        let canFulfill;
        // check if slots can be handled
        for (let input in this.$inputs) {
            if (knownSlots.includes(this.$inputs[input])) {
                canUnderstand = 'YES';
                canFulfill = 'YES';
                this.$alexaSkill.canFulfillSlot(this.$inputs[input], canUnderstand, canFulfill);
                canFulfillOneOrMoreSlots = true;
            } else {
                canUnderstand = 'NO';
                canFulfill = 'NO';
                this.$alexaSkill.canFulfillSlot(this.$inputs[input], canUnderstand, canFulfill);
                canFulfillEverySlot = false;
            }
        }
        const knownIntents = ['NameIntent', 'Name', 'MyNameIntent'];
        if (knownIntents.includes(this.$request.getIntentName()) && canFulfillEverySlot) {
            this.$alexaSkill.canFulfillRequest();
        } else if (knownIntents.includes(this.$request.getIntentName()) || canFulfillOneOrMoreSlots) {
            this.$alexaSkill.mayFulfillRequest();
        } else {
            this.$alexaSkill.cannotFulfillRequest();
        }
    }
});