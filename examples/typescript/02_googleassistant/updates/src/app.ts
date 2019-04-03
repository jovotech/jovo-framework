
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

const quotes = [
    "Without music, live would be a mistake.",
    "All truly great thoughts are conceived by walking.",
    "Whoever fights monsters should see to it that in the" +
    " process he does not become a monster. And if you gaze" +
    " long enough into an abyss, the abyss will gaze back to you",
    "The individual has always had to struggle to keep from" +
    " being overwhelmed by the tribe. If you try it, you will" +
    " be lonely often, and sometimes frightened. But no price" +
    " is too high to pay for the privilege of owning yourself.",
    "Whenever I climb I am followed by a dog called 'Ego'",
    "There is always some madness in love. But there is also" +
    " always some reason in madness.",
    "Love is blind; friendship closes its eyes.",
    "Thoughts are the shadows of our feelings - always darker," +
    " emptier and simplier.",
    "To live is to suffer, to survive is to find some meaning" +
    " in the suffering.",
    "It is not a lack of love, but a lack of friendship that" +
    " makes unhappy marrieges."
];
app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
);

app.setHandler({
    LAUNCH() {
        this.$googleAction!.showSuggestionChips([
            "yes",
            "no",
            "read some quote"
        ]);

        return this.followUpState("UpdateState")
            .ask("Would you like to receive daily updates?");
    },

    UpdateState: {
        YesIntent() {
            return this.$googleAction!.$updates!.askForRegisterUpdate("QuoteIntent");
        },

        NoIntent() {
            return this.tell("Ok then, here is a Nietzsche's quote: " + sample());
        }

    },

    ON_REGISTER_UPDATE() {
        if (this.$googleAction!.$updates!.isRegisterUpdateOk()) {
            this.tell("You will be receiving some quotes");
        } else {
            this.toIntent("QuoteIntent");
        }
    },

    QuoteIntent() {
        this.tell(sample());
    },
});

function sample() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

export {app};
