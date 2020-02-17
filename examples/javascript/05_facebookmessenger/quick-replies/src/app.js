'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const {
	FacebookMessenger,
	TextQuickReply
} = require('jovo-platform-facebookmessenger');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { DialogflowNlu } = require('jovo-nlu-dialogflow');

const app = new App();

const messenger = new FacebookMessenger({
	pageAccessToken: process.env.FB_MESSENGER_PAGE_ACCESS_TOKEN
});

messenger.use(
	new DialogflowNlu({
		credentialsFile: '../credentials.json'
	})
);

app.use(messenger, new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
		if (this.$messengerBot) {
			this.$messengerBot
				.setQuickReplies([new TextQuickReply('John'), 'Jack', 'Anna'])
				.addQuickReply('More');
		}
	},

	MyNameIsIntent() {
		console.log(this.$request.getInputs());

		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
		if (this.$messengerBot) {
			this.$messengerBot.showText({
				text: 'Is there anything else I can do for you?',
				quickReplies: ['Exit']
			});
		}
	}
});

module.exports.app = app;
