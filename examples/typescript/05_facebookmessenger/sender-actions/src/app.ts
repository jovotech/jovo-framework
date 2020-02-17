import { FileDb } from 'jovo-db-filedb';
import { App } from 'jovo-framework';
import {
	FacebookMessenger,
	SenderActionType
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

function delay(amountInMs: number) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, amountInMs);
	});
}

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	async HelloWorldIntent() {
		await this.$messengerBot?.showAction(SenderActionType.MarkSeen);
		await delay(100);
		await this.$messengerBot?.showAction(SenderActionType.TypingOn);
		await delay(1000);
		await this.$messengerBot?.showAction(SenderActionType.TypingOff);
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	}
});

export { app };
