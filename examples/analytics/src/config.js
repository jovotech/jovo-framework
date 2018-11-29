module.exports = {
   logging: true,
   // v1: {
   //    logging: true,
   // },
   //
   // intentMap: {
   //    'AMAZON.StopIntent': 'END',
   // },
   //
    db: {
        FileDb: {
            pathToFile: './db/blub.json'
        }
    },
    plugin: {
        BasicLogging: {
            // logging: true,
        }
    },
        analytics: {
            DashbotAlexa: {
                key: '6Idg1n3pCbk4bMh4XYubQVx5ckjVtuHctMND4sMM',
            },
            DashbotGoogleAssistant: {
                key: '1T3ZonKcbNzLv6eFLBwI9Fv8JAU5SBVorCCvvD1D',
            }
        }
};
