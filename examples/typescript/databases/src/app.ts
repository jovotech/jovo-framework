
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import { MySQL } from 'jovo-db-mysql';
import { MongoDb } from 'jovo-db-mongodb';


const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
    // new MySQL({
    //     tableName: 'users',
    //     connection: {
    //         host     : 'localhost',
    //         user     : 'root',
    //         password : '',
    //         database : 'test'
    //     }
    // }),
    new MongoDb({
        uri: '<uri>',
        databaseName: 'dbname'
    })
);

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});


export {app};
