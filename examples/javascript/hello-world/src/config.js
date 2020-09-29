const { config } = require('jovo-framework');

module.exports = config({
	logging: {
		request: true,
		response: true,
		styling: false,
	},
	intentMap: {
		'AMAZON.HelpIntent': 'HelpIntent'
	},
	db: {
		FileDb: {
			pathToFile: './../db/db.json'
		}
	},
});
