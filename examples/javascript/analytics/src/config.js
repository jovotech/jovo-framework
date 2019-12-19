const { config } = require('jovo-framework');

module.exports = config({
	logging: true,
	analytics: {
		BotAnalyticsAlexa: {
			key: 'keyAlexa'
		},
		BotAnalyticsGoogleAssistant: {
			key: 'keyGoogleAssistant'
		},
		BespokenAlexa: {
			key: 'keyAlexa'
		},
		BespokenGoogleAssistant: {
			key: 'keyGoogleAssistant'
		},
		DashbotAlexa: {
			key: 'keyAlexa'
		},
		DashbotGoogleAssistant: {
			key: 'keyGoogleAssistant'
		},
		ChatbaseAlexa: {
			key: 'keyAlexa',
			appVersion: ''
		},
		ChatbaseGoogleAssistant: {
			key: 'keyGoogleAssistant',
			appVersion: ''
		},
		GoogleAnalytics: {
			trackingId: ''
		}
	}
});
