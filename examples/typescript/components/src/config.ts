const config = {
    logging: true,

    intentMap: {
        'AMAZON.StopIntent': 'END',
    },
    db: {
        FileDb: {
            pathToFile: './../../db/db.json'
        }
    },
    components: {
        GetPhoneNumber: {
            numberOfFails: 2
        }
    }

};

export = config;
