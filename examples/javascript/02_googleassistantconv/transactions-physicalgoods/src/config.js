const { config } = require('jovo-framework');

module.exports = config({
	logging: true,

	intentMap: {
		'AMAZON.StopIntent': 'END',
		'actions.intent.CANCEL': 'CancelIntent',
	},
	db: {
		FileDb: {
			pathToFile: './../../db/db.json',
		},
	},
});
