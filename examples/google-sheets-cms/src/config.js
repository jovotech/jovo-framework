
module.exports = {
    logging: true,
    // v1: {
    //    logging: true,
    // },
    //
    intentMap: {
      'AMAZON.StopIntent': 'END',
    },
    db: {
        default: 'DynamoDb',
        FileDb: {
            pathToFile: './db/db.json'
        }
    },

    cms: {
        GoogleSheetsCMS: {
           credentialsFile: './credentials.json',
            spreadsheetId: '10ZolCwMpmkfL5rB0IKJsPQqJ9EsMJvBVd2WPbJqf0xs',
            sheets: [
               {
                    name: 'config',
                    type: 'KeyValue'
               },
               {
                   name: 'config2',
                   type: 'KeyValue'
               },
            ]
       }
    }

};
