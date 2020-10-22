import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import { NlpjsNlu } from 'jovo-nlu-nlpjs';

const app = new App();

const googleAssistant = new GoogleAssistant();
app.use(googleAssistant, new JovoDebugger(), new FileDb());
googleAssistant.use(new NlpjsNlu());

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
});

export { app };
