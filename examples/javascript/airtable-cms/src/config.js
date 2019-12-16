const { config } = require('jovo-framework');

module.exports = config({
	// logging: true,
	intentMap: {
		'AMAZON.StopIntent': 'END'
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
			],
		}
	}
});
