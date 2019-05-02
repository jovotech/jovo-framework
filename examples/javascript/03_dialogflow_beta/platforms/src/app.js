'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const {Dialogflow, FacebookMessenger} = require("jovo-platform-dialogflow");

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { Util } = require('jovo-core');

const https = require('https');
const app = new App();
require('dotenv').config();
app.use(
    new Alexa(),
    new Dialogflow().use(new FacebookMessenger()),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);

// THIS IS WORK IN PROGESS!!!!
// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    async HelloWorldIntent() {
        await message.call(this, 'Hello Facebook1');
        await message.call(this, 'Hello Facebook2');
        await message.call(this, 'Hello Facebook3');
        this.tell('bla');
        await this.$messengerBot.typingOn();
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});


async function message(text) {

    const payload = {
        "messaging_type": "RESPONSE",
        "recipient": {
            "id": this.$user.getId()
        },
        "message": {
            "text": text
        }
    };

    await Util.post('https://graph.facebook.com/v3.3/me/messages?access_token='+ process.env.PAGE_ACCESS_TOKEN, payload);


}

module.exports.app = app;
