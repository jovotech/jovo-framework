'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const {
	FacebookMessenger,
	SenderActionType
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

function delay(amountInMs) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, amountInMs);
	});
}

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	async HelloWorldIntent() {
		if(this.$messengerBot) {
			await this.$messengerBot.showAction(SenderActionType.MarkSeen);
			await delay(100);
			await this.$messengerBot.showAction(SenderActionType.TypingOn);
			await delay(1000);
			await this.$messengerBot.showAction(SenderActionType.TypingOff);
		}
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		console.log(this.$request.getInputs());

		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	}
});

module.exports.app = app;
