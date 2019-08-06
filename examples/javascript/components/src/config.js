module.exports = {
   logging: false,
    intentMap: {
        'AMAZON.StopIntent': 'END',
    },
    db: {
        FileDb: {
            pathToFile: './../db/db.json'
        }
    },
    components: {
        PHONE_NUMBER: {
            numberOfFails: 3
        }
    }
};
