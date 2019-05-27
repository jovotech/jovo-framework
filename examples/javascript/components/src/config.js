module.exports = {
   logging: true,
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
            intentMap: {
                'AMAZON.HelpIntent': 'COMPONENT_PHONE_NUMBER_HelpIntent',
                'HelpIntent': 'COMPONENT_PHONE_NUMBER_HelpIntent',
            }
        }
    }

};
