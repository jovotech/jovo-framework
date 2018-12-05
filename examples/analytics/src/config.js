module.exports = {
	logging: true,
	// v1: {
	//    logging: true,
	// },
	//
	// intentMap: {
	//    'AMAZON.StopIntent': 'END',
	// },
	//
	db: {
		FileDb: {
			pathToFile: './db/blub.json'
		}
	},
	plugin: {
		BasicLogging: {
			// logging: true,
		}
	},
	analytics: {
		BotAnalyticsAlexa: {
			key: '1357315febb02b523433bb8e03bcea72c4019726',
		}
	}
};
