'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(new Alexa(), new GoogleAssistant(), new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		throw new Error('Oops.');
	},
	ON_ERROR() {
		console.log(this.$handleRequest.error);
		this.tell('Sorry, something went wrong.');
	},
});

module.exports.app = app;
