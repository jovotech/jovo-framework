import { config } from 'jovo-framework';

// tslint:disable-next-line
export = config({
	logging: true,

	intentMap: {
		'AMAZON.StopIntent': 'END'
	},
	db: {
		FileDb: {
			pathToFile: './../../db/db.json'
		}
	},
	cms: {
		AirtableCMS: {
			apiKey: '<api-key>',
			baseId: '<base-id>',
			tables: [
				{
					name: 'test',
					table: 'Table 1',
					type: 'Responses'
				},
				{
					name: 'test2',
					table: 'Table 2',
					type: 'ObjectArray',
					selectOptions: {
						fields: ['Name', 'Location']
					}
				}
			]
		}
	}
});
