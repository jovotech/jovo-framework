const { config } = require('jovo-framework');

module.exports = config({
	logging: true,

	intentMap: {
		'AMAZON.StopIntent': 'END',
		'AMAZON.PauseIntent': 'PauseIntent',
		'AMAZON.ResumeIntent': 'ResumeIntent'
	}
});
