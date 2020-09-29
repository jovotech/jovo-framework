import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask(`Let's start the onboarding.`);
		this.$googleAction!.setNextScene('FetchDataScene');
	},

	ON_SCENE() {
		const scene = this.$googleAction!.$scene!;
		if (scene.isSlotFillingFinal()) {
			const slots = scene.slots;
			this.tell(
				`Hi ${slots.name.value}! You said, you're ${slots.age.value} years old.`
			);
		}
	},
});

export { app };
