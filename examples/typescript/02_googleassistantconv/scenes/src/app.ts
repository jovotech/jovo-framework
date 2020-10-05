import { App } from 'jovo-framework';

import { GoogleAssistant, Slot } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		this.ask(`Let's start the onboarding.`);
		// this.$googleAction!.setNextScene('CollectingDataScene');
		const scene = this.$googleAction!.$scene!;

		if (scene?.isSlotFillingCollecting()) {
			return this.toIntent('ON_SCENE');
		}
	},

	ON_SCENE() {
		const scene = this.$googleAction!.$scene!;
		const slots = scene.slots as Record<string, Slot>;

		if (scene.isSlotFillingCollecting()) {
			if (!slots.name.value) {
				return this.ask(`What's your name?`);
			} else if (!slots.age.value) {
				return this.ask(`How old are you?`);
			}
		} else if (scene.isSlotFillingFinal()) {
			this.tell(
				`Hi ${slots.name.value}! You said, you're ${slots.age.value} years old.`
			);
		}
	},
});

export { app };
