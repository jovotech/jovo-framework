
module.exports = {
    // logging: true,
    // v1: {
    //    logging: true,
    // },
    //
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

            // sheets: [
            //    {
            //        spreadsheetId: '15qFRCOiqHYARTBZRZxaVCnHFNRnFtUM4rCuNkUAUu5s',
            //        access: 'public',
            //        position: 2,
            //         name: 'config',
            //         type: 'KeyValue'
            //    },
            //    {
            //        spreadsheetId: '15qFRCOiqHYARTBZRZxaVCnHFNRnFtUM4rCuNkUAUu5s',
            //        access: 'public',
            //        position: 1,
            //        name: 'responses',
            //        type: 'Responses'
            //    },
            // ]
            sheets: [
                {
                    spreadsheetId: '1Ey2kAbmPUnAzRuK1llmhYYuoRbALqfuoVpaobVydytM',
                    name: 'responses',
                    access: 'public',
                    type: 'Responses',
                    position: 1,
                    caching: false
                },
                // {
                //     spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
                //     name: 'answers',
                //     access: 'public',
                //     type: 'KeyValue',
                //     position: 2,
                // }
            ]
        }
    }

};
