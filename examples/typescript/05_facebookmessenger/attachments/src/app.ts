import { FileDb } from 'jovo-db-filedb';
import { App } from 'jovo-framework';
import {
	AttachmentType,
	FacebookMessenger
} from 'jovo-platform-facebookmessenger';

import { JovoDebugger } from 'jovo-plugin-debugger';
import { DialogflowNlu } from 'jovo-nlu-dialogflow';
import { join } from 'path';

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
		this.$messengerBot?.showAttachment({
			type: AttachmentType.Image,
			data: 'https://via.placeholder.com/150'
		});
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');

		const testFilePath = join(__dirname, '../..', 'test-file.json');
		this.$messengerBot?.showAttachment({
			type: AttachmentType.File,
			data: { path: testFilePath, fileName: 'test-file.json' }
		});
	}
});

export { app };
