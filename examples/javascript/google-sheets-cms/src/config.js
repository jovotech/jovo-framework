
module.exports = {
    logging: true,

    intentMap: {
        'AMAZON.StopIntent': 'END',
    },
    db: {
        FileDb: {
            pathToFile: '.././db/db.json'
        }
    },

    cms: {
        GoogleSheetsCMS: {
            spreadsheetId: '1Ey2kAbmPUnAzRuK1llmhYYuoRbALqfuoVpaobVydytM',
            access: 'public',
            // credentialsFile: './credentials.json',
            sheets: [
                {
                    name: 'Sheet1',
                    range: 'A:Z',
                    type: 'Responses',
                },
            ],
        }
    }

};
