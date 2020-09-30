import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		// return this.ask('Do you want to link you account?');
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		// @ts-ignore
		this.$googleAction!.setNextScene('AccountLinking');
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
});

export { app };
