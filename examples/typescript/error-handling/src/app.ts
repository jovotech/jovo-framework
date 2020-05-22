import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new Alexa(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		throw new Error('Oops.');
	},
	ON_ERROR() {
		console.log(this.$handleRequest!.error);
		this.tell('Sorry, something went wrong.');
	},
});

export { app };
