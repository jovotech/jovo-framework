import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	async LAUNCH() {
		// this.$googleAction!.$audioPlayer!.playAudio(
		// 	{
		// 		name: 'Media name',
		// 		description: 'Media description',
		// 		url:
		// 			'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
		// 		image: {
		// 			large: {
		// 				alt: 'Jazz in Paris album art',
		// 				height: 0,
		// 				url:
		// 					'https://storage.googleapis.com/automotive-media/album_art.jpg',
		// 				width: 0,
		// 			},
		// 		},
		// 	},
		// 	'20s'
		// );
		// this.ask('start');

		const userProfile = await this.$googleAction!.$user.getGoogleProfile();
		console.log(userProfile);
		this.ask('Do you want to link your account?');
	},
	AUDIOPLAYER: {
		'GoogleAction.Paused'() {
			// no response posible
			this.tell('Playback paused');
		},
		'GoogleAction.Stopped'() {
			// no response posible
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
