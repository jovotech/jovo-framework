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
    user: {
        sessionData: {
            enabled: true,
            id: true
        }
    }
};

export = config;
