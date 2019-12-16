const { config } = require('jovo-framework');

module.exports = config({
	logging: false,

	intentMap: {
		'AMAZON.StopIntent': 'END'
	}
});
