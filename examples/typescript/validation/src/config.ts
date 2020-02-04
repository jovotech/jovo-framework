import { config } from 'jovo-framework';

// tslint:disable-next-line
export = config({
	logging: false,

	intentMap: {
		'AMAZON.StopIntent': 'END'
	},
	db: {
		FileDb: {
			pathToFile: './../../db/db.json'
		}
	}
});
