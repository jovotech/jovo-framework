const {App} = require('jovo-framework');
const {
    Alexa} = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
);


app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.$alexaSkill.replaceDynamicEntities([{
            name: 'MarvelHero',
            values: [
                {
                    id: 'Thor',
                    name: {
                        value: 'Thor',
                        synonyms: ['Thor']
                    }
                },
                {
                    id: 'Spiderman',
                    name: {
                        value: 'Spiderman',
                        synonyms: ['Spiderman']
                    }
                },
                { // replace static entity
                    id: 'TonyStark',
                    name: {
                        value: 'Iron man',
                        synonyms: ['Ironman', 'Tony Stark']
                    }
                }
            ]
        }
        ]);
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {

        console.log(this.$alexaSkill.hasEntityMatch('name'));
        console.log(this.$alexaSkill.getEntityMatches('name'));
        console.log(this.$alexaSkill.getDynamicEntityMatches('name'));
        console.log(this.$alexaSkill.getStaticEntityMatches('name'));

        this.$alexaSkill.clearDynamicEntities();
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});


module.exports.app = app;
