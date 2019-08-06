const config = {
    logging: false,

    intentMap: {
        'AMAZON.StopIntent': 'END',
    },
    db: {
        FileDb: {
            pathToFile: './../../db/db.json'
        }
    }
};

module.exports = { config };
