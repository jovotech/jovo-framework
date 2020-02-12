'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework/dist/src');
const { FacebookMessenger } = require('jovo-platform-facebookmessenger');
const { LuisNlu } = require('jovo-nlu-luis');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

const messenger = new FacebookMessenger({
	verifyToken: 'VerificationToken'
});

messenger.use(
	new LuisNlu({
		appId: process.env.LUIS_APP_ID,
		endpointRegion: 'westus',
		endpointKey: process.env.LUIS_ENDPOINT_KEY
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
	},

	MyNameIsIntent() {
		console.log(this.$request.getInputs());

		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	}
});

module.exports.app = app;
