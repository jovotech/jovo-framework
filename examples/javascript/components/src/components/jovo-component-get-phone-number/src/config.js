const config = {
	intentMap: {
		'AMAZON.HelpIntent': 'HelpIntent',
		'AMAZON.NoIntent': 'NoIntent',
		'AMAZON.StopIntent': 'END',
		StopIntent: 'END',
		'AMAZON.YesIntent': 'YesIntent'
	},
	numberOfFails: 3
};

module.exports = config;
