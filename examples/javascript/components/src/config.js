const { config } = require('jovo-framework');

module.exports = config({
	logging: false,
	intentMap: {
		'AMAZON.StopIntent': 'END'
	},
	db: {
		FileDb: {
			pathToFile: './../db/db.json'
		}
	},
	components: {
		PHONE_NUMBER: {
			numberOfFails: 2
		}
	}
});
