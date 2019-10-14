
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { DynamoDb } = require('jovo-db-dynamodb');
const { DatastoreDb } = require('jovo-db-datastore');
const { MySQL } = require('jovo-db-mysql');


const app = new App();
Util.consoleLog();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
    new MySQL({
        tableName: 'users',
        connection: {
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'test'
        }
    })
);

app.setHandler({
    async LAUNCH() {
        console.log(this.$user.$data.lastVisit);

        if (!this.$user.$data.lastVisit) {
            this.$user.$data.lastVisit = new Date().toISOString();
            this.tell('Hello new friend');
        } else {
            this.tell('Last visit: ' + this.$user.$data.lastVisit);
        }
    },
    async DeleteIntent() {
        await this.$user.delete();
        this.tell('User Deleted');
    }
});


module.exports.app = app;
