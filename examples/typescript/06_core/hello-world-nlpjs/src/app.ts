import { FileDb } from 'jovo-db-filedb';
import { App } from 'jovo-framework';
import { CorePlatform } from 'jovo-platform-core';

import { JovoDebugger } from 'jovo-plugin-debugger';
import { NlpjsNlu } from 'jovo-nlu-nlpjs';

const app = new App();

const corePlatform = new CorePlatform();

corePlatform.use(
	new NlpjsNlu({}),
);

app.use(corePlatform, new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.$corePlatformApp?.showQuickReplies(['Joe', 'Jane', 'Max']);
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
	DefaultFallbackIntent() {
		this.tell('Good Bye!');
	}
});

export { app };
