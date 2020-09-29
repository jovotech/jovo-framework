'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App, Log } = require('jovo-framework');
const {
	AttachmentType,
	FacebookMessenger,
} = require('jovo-platform-facebookmessenger');
const { DialogflowNlu } = require('jovo-nlu-dialogflow');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { join } = require('path');

const app = new App();

const messenger = new FacebookMessenger({
	pageAccessToken: process.env.FB_MESSENGER_PAGE_ACCESS_TOKEN,
});

messenger.use(
	new DialogflowNlu({
		credentialsFile: '../credentials.json',
	})
);

app.use(messenger, new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

function handleSendMessageError(err) {
	Log.error((err.response && err.response.data) || err.message);
}

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	async HelloWorldIntent() {
		if (this.$messengerBot) {
			try {
				await this.$messengerBot.showAttachment({
					type: AttachmentType.Image,
					data: 'https://via.placeholder.com/150',
				});
			} catch (e) {
				handleSendMessageError(e);
			}
		}
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	async MyNameIsIntent() {
		if (this.$messengerBot) {
			const testFilePath = join(__dirname, '..', 'test-file.json');
			try {
				await this.$messengerBot.showAttachment({
					type: AttachmentType.File,
					data: { path: testFilePath, fileName: 'test-file.json' },
				});
			} catch (e) {
				handleSendMessageError(e);
			}
		}
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
});

module.exports.app = app;
