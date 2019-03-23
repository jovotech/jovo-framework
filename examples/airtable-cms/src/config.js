module.exports = {
    logging: true,
    intentMap: {
        'AMAZON.StopIntent': 'END',
    },
    cms: {
        AirtableCMS: {
            apiKey: 'keyEFgJNdTeUauiFk',
            baseId: 'lPIL3akWhaw0EZ',
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
};
