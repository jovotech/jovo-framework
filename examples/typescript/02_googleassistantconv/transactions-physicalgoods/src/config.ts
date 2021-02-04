import { config } from 'jovo-framework';

// tslint:disable-next-line
export = config({
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
