const config = {
    logging: true,

    intentMap: {
      'AMAZON.StopIntent': 'END',
    },

    analytics: {
        BotAnalyticsAlexa: {
            key: 'keyAlexa',
        },
        BotAnalyticsGoogleAssistant: {
            key: 'keyGoogleAssistant',
        },
        BespokenAlexa: {
            key: 'keyAlexa',
        },
        BespokenGoogleAssistant: {
            key: 'keyGoogleAssistant',
        },
        DashbotAlexa: {
            key: 'keyAlexa',
        },
        DashbotGoogleAssistant: {
            key: 'keyGoogleAssistant',
        },
        ChatbaseAlexa: {
            key: 'keyAlexa',
            appVersion: '',
        },
        ChatbaseGoogleAssistant: {
            key: 'keyGoogleAssistant',
            appVersion: '',
        }
    },
    db: {
        FileDb: {
            pathToFile: './../../db/db.json'
        }
    },
};

export = config;
