'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { CorePlatform } = require('jovo-platform-core');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { LexSlu } = require('jovo-slu-lex');
require('dotenv').config();

const app = new App();

const corePlatform = new CorePlatform();
const credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_REGION
};

corePlatform.use(
	new LexSlu({
		credentials,
		botAlias: 'WebTest',
		botName: 'WebAssistantTest'
	})
);

app.use(corePlatform, new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------
console.log(process.env.AWS_ACCESS_KEY_ID);

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		if (this.$corePlatformApp) {
			this.$corePlatformApp.showQuickReplies(['Joe', 'Jane', 'Max']);
		}
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
	DefaultFallbackIntent() {
		this.tell('Good Bye!');
	}
});

module.exports.app = app;
