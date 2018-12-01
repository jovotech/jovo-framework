
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
    // new DynamoDb(),
);



// if (process.env.NODE_ENV === 'prod') {
    const { DynamoDb } = require('jovo-db-dynamodb');
    app.use(new DynamoDb({
        tableName: 'testV2Bug',
        awsConfig: {
            region: 'us-east-1',

        }
    }));
// }


app.setHandler({
    async LAUNCH(jovo) {
        this.$speech.addText('Hello');
        // return this.tell(this.$speech);
        // await this.$user.load();
        this.toIntent('HelloWorldIntent');
        // this.tell('Hello');
        // await this.$user.save();
    },
    HelloWorldIntent() {
        this
            .followUpState('NameState')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    NameState: {
        MyNameIsIntent() {
            this.$user.$data.name = this.$inputs.name.value;
            return this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');

        },
    }
});


module.exports.app = app;
