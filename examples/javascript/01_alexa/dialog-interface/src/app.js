const {App} = require('jovo-framework');
const {
    Alexa} = require('jovo-platform-alexa');

const app = new App();

app.use(
    new Alexa()
);

const delegate = (jovo) => {
    if (!jovo.$alexaSkill.dialog().isCompleted()) {
        jovo.$alexaSkill.dialog().delegate();
    } else {
        jovo.tell('Name: ' + jovo.getInput('name').value + ', City: ' + jovo.getInput('city').value + ', Age: ' + jovo.getInput('age').value + ' years old.');
    }
};

const elicitSlot = (jovo) => {
    if (!jovo.$alexaSkill.dialog().isCompleted()) {
        if(!jovo.$inputs.age.value) {
            return jovo.$alexaSkill.dialog().elicitSlot('age', 'How old are you?', 'What\'s your age?');
        } else {
            jovo.$alexaSkill.dialog().delegate();
        }
    }
};

const delegateUpdateIntent = (jovo) => {
    if (!jovo.$alexaSkill.dialog().isCompleted()) {
        if(jovo.$inputs.name.value && jovo.$inputs.name.value.toLowerCase() === 'joe') {

            const updatedIntent = {
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
            return jovo.$alexaSkill.dialog().delegate(updatedIntent);
        } else {
            jovo.$alexaSkill.dialog().delegate();
        }
    }
};


app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        delegate(this);
        // elicitSlot(this);
        // delegateUpdateIntent(this);
    },
});





module.exports.app = app;
