import { FileDb } from 'jovo-db-filedb';
import { App } from 'jovo-framework';
import { ActionType, CorePlatform } from 'jovo-platform-core';

import { JovoDebugger } from 'jovo-plugin-debugger';
import { AmazonCredentials, AmazonLexSlu } from 'jovo-slu-lex';
import { ActionBuilder } from 'jovo-platform-core/dist/src/ActionBuilder';

const app = new App();

const corePlatform = new CorePlatform();
const credentials: AmazonCredentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	secretAccessKey: process.env.AWS_SECRET_KEY!,
	region: process.env.AWS_REGION!
};

corePlatform.use(
	// new AmazonPollyTts({
	// 	credentials
	// }),
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
		if (this.$corePlatformApp) {
			this.$corePlatformApp.$actions
				.addSpeech({
					ssml: 'testssml',
					displayText: 'setValue'
				})
				.addContainer(
					new ActionBuilder()
						.addSpeech({ plain: 'plain' })
						.addSpeech({ plain: 'another one' })
						.build(),
					ActionType.ParallelContainer
				);
		}
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	}
});

export { app };
