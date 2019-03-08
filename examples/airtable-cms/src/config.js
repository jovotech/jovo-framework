module.exports = {
    logging: true,
    intentMap: {
        'AMAZON.StopIntent': 'END',
    },
    cms: {
        AirtableCMS: {
            apiKey: '<api-key>',
            baseId: '<base-id>',
            sheets: [
                {
                    name: 'test',
                    table: 'Table 1',
                    type: 'Responses'
                },
                {
                    name: 'test2',
                    table: 'Table 2',
                    type: 'ObjectArray'
                }
            ]
        }
    }
};
