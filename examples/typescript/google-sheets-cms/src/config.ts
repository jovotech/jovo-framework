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
		GoogleSheetsCMS: {
			spreadsheetId: '1adMWErUl7xrtmKCBiMjEJCfkWWHgmxASId5eeRRVBSc',
			access: 'private',
			credentialsFile: './credentials.json',
			sheets: [
				{
					name: 'testSheet',
					range: 'A:Z',
					type: 'ObjectArray'
				}
			]
		}
	},
});
