import { FileDb } from 'jovo-db-filedb';
import { App } from 'jovo-framework';
import { LuisNlu } from 'jovo-nlu-luis';
import { FacebookMessenger } from 'jovo-platform-facebookmessenger';

import { JovoDebugger } from 'jovo-plugin-debugger';

const app = new App();

const messenger = new FacebookMessenger({
	verifyToken: 'VerificationToken',
});

messenger.use(
	new LuisNlu({
		appId: process.env.LUIS_APP_ID!,
		endpointHost: 'westus.api.cognitive.microsoft.com',
		endpointKey: process.env.LUIS_ENDPOINT_KEY!
	})
);

app.use(messenger, new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	}
});

export { app };
