module.exports = {
    // logging: true,
    // v1: {
    //    logging: true,
    // },
    //
    // intentMap: {
    //    'AMAZON.StopIntent': 'END',
    // },
    //
    db: {
        default: 'MongoDb',
        FileDb: {
            pathToFile: './db/db.json'
        },
        MongoDb: {
            databaseName: 'database',
            uri: ''
        }
    },

};
