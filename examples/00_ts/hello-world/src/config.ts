module.exports = {
   logging: true,

   intentMap: {
      'AMAZON.StopIntent': 'END',
   },
    db: {
        FileDb: {
            pathToFile: './db/db.json'
        }
    },
};
