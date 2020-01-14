'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { CorePlatform } = require('jovo-platform-core');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { AmazonCredentials, AmazonLexSlu } = require('jovo-slu-lex');

const app = new App();

const corePlatform = new CorePlatform();
const credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_REGION
};

corePlatform.use(
	new AmazonLexSlu({
		credentials,
		botAlias: 'WebTest',
		botName: 'WebAssistantTest'
	})
);

app.use(corePlatform, new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		console.log(this.$request.getInputs());

		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	}
});

module.exports.app = app;
