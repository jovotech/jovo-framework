import { config } from 'jovo-framework';

// tslint:disable-next-line
export default config({
	logging: true,

	intentMap: {
		'AMAZON.StopIntent': 'END'
	},
	db: {
		FileDb: {
			pathToFile: './../../db/db.json'
		}
	}
});
