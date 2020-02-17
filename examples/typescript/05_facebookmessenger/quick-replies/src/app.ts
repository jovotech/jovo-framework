import { FileDb } from 'jovo-db-filedb';
import { App } from 'jovo-framework';
import {
	FacebookMessenger,
	TextQuickReply
} from 'jovo-platform-facebookmessenger';

import { JovoDebugger } from 'jovo-plugin-debugger';
import { DialogflowNlu } from 'jovo-nlu-dialogflow';

const app = new App();

const messenger = new FacebookMessenger({
	pageAccessToken: process.env.FB_MESSENGER_PAGE_ACCESS_TOKEN
});

messenger.use(
	new DialogflowNlu({
		credentialsFile: '../../credentials.json'
	})
);

app.use(messenger, new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
		this.$messengerBot
			?.setQuickReplies([new TextQuickReply('John'), 'Jack', 'Anna'])
			.addQuickReply('More');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
		this.$messengerBot?.showText({
			text: 'Is there anything else I can do for you?',
			quickReplies: ['Exit']
		});
	}
});

export { app };
