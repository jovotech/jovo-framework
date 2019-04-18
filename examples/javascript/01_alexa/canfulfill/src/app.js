const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger()
);


app.setHandler({
    LAUNCH() {
        this.tell('Hello World');
    },

    CAN_FULFILL_INTENT() {
        const knownSlots = ['name', 'city'] // other known slots
        let canFulfillOneOrMoreSlots = false;
        let canFulfillEverySlot = true;
        let canUnderstand;
        let canFulfill;
        // check if slots can be handled
        for (let input in this.$inputs) {
            if (knownSlots.includes(this.$inputs[input].name)) {
                canUnderstand = 'YES';
                canFulfill = 'YES';
                this.$alexaSkill.canFulfillSlot(this.$inputs[input].name, canUnderstand, canFulfill);
                canFulfillOneOrMoreSlots = true;
            } else {
                canUnderstand = 'NO';
                canFulfill = 'NO';
                this.$alexaSkill.canFulfillSlot(this.$inputs[input].name, canUnderstand, canFulfill);
                canFulfillEverySlot = false;
            }
        }
        const knownIntents = ['NameIntent', 'MyNameIntent', 'MyNameIsIntent', 'CityIntent'];
        if (knownIntents.includes(this.$request.getIntentName()) && canFulfillEverySlot) {
            // We know the intent and can fulfill every slot -> We can fulfill the request
            this.$alexaSkill.canFulfillRequest();
        } else if (knownIntents.includes(this.$request.getIntentName()) || canFulfillOneOrMoreSlots) {
            // We know either the intent or can fulfill one or more slots -> We may fulfill the request
            this.$alexaSkill.mayFulfillRequest();
        } else {
            // we can't fulfill anything
            this.$alexaSkill.cannotFulfillRequest();
        }
    }
});


module.exports.app = app;
