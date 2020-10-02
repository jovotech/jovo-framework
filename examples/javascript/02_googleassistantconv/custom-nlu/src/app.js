'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { NlpjsNlu } = require('jovo-nlu-nlpjs');

const app = new App();
const googleAssistant = new GoogleAssistant();
app.use(googleAssistant, new JovoDebugger(), new FileDb());
googleAssistant.use(new NlpjsNlu());

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
	},
});

module.exports.app = app;
