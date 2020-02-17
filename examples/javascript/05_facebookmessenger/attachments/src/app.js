'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const {
	AttachmentType,
	FacebookMessenger
} = require('jovo-platform-facebookmessenger');
const { DialogflowNlu } = require('jovo-nlu-dialogflow');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { join } = require('path');

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
			this.$messengerBot.showAttachment({
				type: AttachmentType.Image,
				data: 'https://via.placeholder.com/150'
			});
		}
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');

		const testFilePath = join(__dirname, '..', 'test-file.json');
		if (this.$messengerBot) {
			this.$messengerBot.showAttachment({
				type: AttachmentType.File,
				data: { path: testFilePath, fileName: 'test-file.json' }
			});
		}
	}
});

module.exports.app = app;
