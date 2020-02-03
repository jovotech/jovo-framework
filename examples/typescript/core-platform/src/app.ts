import { FileDb } from 'jovo-db-filedb';
import { App, LogLevel } from 'jovo-framework';
import { CorePlatform } from 'jovo-platform-core';

import { JovoDebugger } from 'jovo-plugin-debugger';
import { AmazonCredentials, AmazonLexSlu } from 'jovo-slu-lex';
import { AmazonPollyTts } from 'jovo-tts-polly';

// process.env.JOVO_LOG_LEVEL = LogLevel.DEBUG as any;

const app = new App();

const corePlatform = new CorePlatform();
const credentials: AmazonCredentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	secretAccessKey: process.env.AWS_SECRET_KEY!,
	region: process.env.AWS_REGION!
};

corePlatform.use(
	new AmazonPollyTts({
		credentials
	}),
	new AmazonLexSlu({
		credentials,
		botAlias: 'WebTest',
		botName: 'WebAssistantTest'
	})
);

app.use(corePlatform, new JovoDebugger(), new FileDb());

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
