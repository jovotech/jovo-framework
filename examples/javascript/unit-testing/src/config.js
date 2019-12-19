const { config } = require('jovo-framework');

module.exports = config({
	logging: false,
	user: {
		metaData: true
	},

	intentMap: {
		'AMAZON.StopIntent': 'END'
	}
});
