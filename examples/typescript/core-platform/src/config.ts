import { config } from 'jovo-framework';

export = config({
	logging: {
		request: true,
		response: true
	},

	intentMap: {
		'AMAZON.StopIntent': 'END'
	},
	db: {
		FileDb: {
			pathToFile: './../../db/db.json'
		}
	}
});
