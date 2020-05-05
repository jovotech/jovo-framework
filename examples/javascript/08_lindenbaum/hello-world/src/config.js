module.exports = {
   logging: true,
    intentMap: {
        'AMAZON.HelpIntent': 'HelpIntent',
    },
    db: {
        FileDb: {
            pathToFile: './../db/db.json'
        }
    },
    user: {
        sessionData: {
            enabled: true,
            id: true
        }
    }
};
