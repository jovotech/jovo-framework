import { config } from 'jovo-framework';

export = config({
	logging: {
		request: true,
		maskRequestObjects: ['request.body.audio'],
		response: true,
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
