
import { App } from 'jovo-framework';
import { Alexa, AlexaSkill, Intent } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);



const delegate = (alexaSkill: AlexaSkill) => {
    if (!alexaSkill.$dialog!.isCompleted()) {
        alexaSkill.$dialog!.delegate();
    } else {
        alexaSkill.tell('Name: ' + alexaSkill.getInput('name').value + ', City: ' + alexaSkill.getInput('city').value + ', Age: ' + alexaSkill.getInput('age').value + ' years old.');
    }
};

const elicitSlot = (alexaSkill: AlexaSkill) => {
    if (!alexaSkill.$dialog!.isCompleted()) {
        if(!alexaSkill.$inputs.age.value) {
            return alexaSkill.$dialog!.elicitSlot('age', 'How old are you?', 'What\'s your age?');
        } else {
            alexaSkill.$dialog!.delegate();
        }
    }
};

const delegateUpdateIntent = (alexaSkill: AlexaSkill) => {
    if (!alexaSkill.$dialog!.isCompleted()) {
        if(alexaSkill.$inputs.name.value && alexaSkill.$inputs.name.value.toLowerCase() === 'joe') {

            const updatedIntent: Intent = {
                name: 'HelloWorldIntent',
                confirmationStatus: 'NONE',
                slots: {
                    name: {
                        name: 'name',
                        value: 'Joe',
                    },
                    city: {
                        name: 'city',
                        value: 'New York',
                    },
                    age: {
                        name: 'age',
                        value: '40',
                        confirmationStatus: 'CONFIRMED',
                    }
                }
            };
            return alexaSkill.$dialog!.delegate(updatedIntent);
        } else {
            alexaSkill.$dialog!.delegate();
        }
    }
};


app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        delegate(this as AlexaSkill);
        // elicitSlot(this as AlexaSkill);
        // delegateUpdateIntent(this as AlexaSkill);
    },
});

export {app};
