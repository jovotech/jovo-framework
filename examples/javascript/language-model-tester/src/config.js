module.exports = {
   logging: true,
   // v1: {
   //    logging: true,
   // },
   //
   intentMap: {
      'AMAZON.StopIntent': 'END',
   },
   //
    db: {
        FileDb: {
            pathToFile: './db/db.json'
        }
    },
    // plugin: {
    //     BasicLogging: {
    //         logging: true,
    //     }
    // }

};
