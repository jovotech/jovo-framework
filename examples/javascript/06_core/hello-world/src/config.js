const { config } = require('jovo-framework');

module.exports = config({
	logging: true,
	intentMap: {
		'AMAZON.HelpIntent': 'HelpIntent'
	},
	db: {
		FileDb: {
			pathToFile: './../db/db.json'
		}
	}
});
