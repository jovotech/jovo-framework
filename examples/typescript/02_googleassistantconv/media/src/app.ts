import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

// behavior on Android phones
// copied from https://developers.google.com/assistant/conversational/prompts-media#behavior_on_android_phones
// Note: Your webhook won't receive callbacks from Google Assistant if the user leaves the Google Assistant
// screen during media playback and media playback finishes while the user is away. Include suggestion
// chips to allow users to continue interacting with your Action when they return to the Google Assistant screen.

app.setHandler({
	async LAUNCH() {
		this.$googleAction!.$audioPlayer!.playAudio({
			name: 'Media name',
			description: 'Media description',
			url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
			image: {
				large: {
					alt: 'Jazz in Paris album art',
					height: 0,
					url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
					width: 0,
				},
			},
		});
		this.ask('start audio');
	},
	AUDIOPLAYER: {
		'GoogleAction.Paused'() {
			const progress = this.$googleAction!.$audioPlayer!.getProgress();
			// this will close the session
			this.tell('Playback paused');
		},
		'GoogleAction.Stopped'() {
			const progress = this.$googleAction!.$audioPlayer!.getProgress();
			// no response possible
		},
		'GoogleAction.Finished'() {
			this.tell('Playback finished');
		},
		'GoogleAction.Failed'() {
			this.tell('Playback failed');
		},
	},

	END() {
		const progress = this.$googleAction!.$audioPlayer!.getProgress();

		// save progress to db

		return this.tell('bye');
	},
});

export { app };
