
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
);

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


export {app};
