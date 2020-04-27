import { config } from 'jovo-framework';

// tslint:disable-next-line
export = config({
	logging: false,
	user: {
		metaData: true
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
