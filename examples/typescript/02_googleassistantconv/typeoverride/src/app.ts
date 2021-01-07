import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		this.$googleAction!.setTypeOverrides([
			{
				name: 'NameInputType',
				mode: 'TYPE_MERGE',
				synonym: {
					entries: [
						{
							name: 'Hans',
							synonyms: ['hans', 'hansi']
						}
					]

				}
			}
		]);
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
});

export { app };
