import { FileDb } from 'jovo-db-filedb';
import { App, AxiosError, Log } from 'jovo-framework';
import {
	AttachmentType,
	FacebookMessenger,
} from 'jovo-platform-facebookmessenger';

import { JovoDebugger } from 'jovo-plugin-debugger';
import { DialogflowNlu } from 'jovo-nlu-dialogflow';
import { join } from 'path';

const app = new App();

const messenger = new FacebookMessenger({
	pageAccessToken: process.env.FB_MESSENGER_PAGE_ACCESS_TOKEN,
});

messenger.use(
	new DialogflowNlu({
		credentialsFile: '../../credentials.json',
	})
);

app.use(messenger, new JovoDebugger(), new FileDb());

function handleSendMessageError(err: AxiosError) {
	Log.error(err.response?.data || err.message);
}

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	async HelloWorldIntent() {
		try {
			await this.$messengerBot?.showAttachment({
				type: AttachmentType.Image,
				data: 'https://via.placeholder.com/150',
			});
		} catch (e) {
			handleSendMessageError(e);
		}
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	async MyNameIsIntent() {
		const testFilePath = join(__dirname, '../..', 'test-file.json');
		try {
			await this.$messengerBot?.showAttachment({
				type: AttachmentType.File,
				data: { path: testFilePath, fileName: 'test-file.json' },
			});
		} catch (e) {
			handleSendMessageError(e);
		}
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
});

export { app };
