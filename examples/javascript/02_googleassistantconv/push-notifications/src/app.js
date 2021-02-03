'use strict';

const { App } = require('jovo-framework');
const {
	GoogleAssistant,
	PushNotificationsApi,
} = require('jovo-platform-googleassistantconv');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		this.$googleAction.setNextScene('PushNotificationsScene');
		this.ask('If you want me to send you notifications, just say "notify me".');
	},

	PushNotificationsClickedIntent() {
		this.tell('Hello World!');
	},

	async ON_PERMISSION() {
		if (
			this.$googleAction.isPermissionGranted() ||
			this.$googleAction.isPermissionAlreadyGranted()
		) {
      const credentials = require('../credentials.json');
			const reminderUserId = this.$googleAction.getNotificationsUserId();

			const api = new PushNotificationsApi(credentials);

			await api.sendPushNotification({
				userId: reminderUserId,
				intent: 'PushNotificationsClickedIntent',
				title: 'Click me!',
				locale: 'en',
			});

			this.ask('Great!');
		} else {
			this.ask('Ok.');
		}
	},
});

module.exports = { app };
