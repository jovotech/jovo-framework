import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

const WEBAPP_URL = 'https://b6f1afe83980.ngrok.io';
app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},
	HelloWorldIntent() {
		this.ask(`Hey! What's your name?`);
	},

	MyNameIsIntent() {
		this.$googleAction!.htmlResponse({
			data: {
				state: 'MyNameIsIntent',
				text: 'Hey ' + this.$inputs.name.value + ', nice to meet you!',
			},
			suppressMic: false,
			url: WEBAPP_URL,
		});
		this.ask('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
});

export { app };
