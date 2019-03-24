module.exports = {
    // logging: true,
    intentMap: {
        'AMAZON.StopIntent': 'END',
    },
    cms: {
        AirtableCMS: {
            apiKey: 'keyEFgJNdTeUauiFk',
            baseId: 'appU5zPjXwV5FCy2i',
            tables: [
                {
                    name: 'test',
                    table: 'test',
                    type: 'Responses',
                    caching: false
                }
            ]
        }
    }
};
