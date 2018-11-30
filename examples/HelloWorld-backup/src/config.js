const secretkey = process.env.secretkey || 7;

module.exports = {
    v1: {
        logging: true,
        userMetaData: {
            lastUsedAt: true,
            sessionsCount: true,
            createdAt: true,
            requestHistorySize: 0,
            devices: false,
        },
        userContext: {
            prev: {
                size: 1,
                request: {
                    intent: true,
                    state: true,
                    inputs: true,
                    timestamp: true,
                },
                response: {
                    speech: true,
                    reprompt: true,
                    state: true,
                },
            },
        },
    },

    intentMap: {
        'AMAZON.StopIntent': 'END',
    },
    // logging infi
    //
    //
    // saveUserOnResponseEnabled: true,
    // userDataCol: 'userData',
    // intentsToSkipUnhandled: [],
    // saveBeforeRespxonseEnabled: false,
    // allowedApplicationIds: [],
    // db: {
    //     type: 'file',
    //     localDbFilename: 'db',
    // },
    // userMetaData: {
    //     lastUsedAt: true,
    //     sessionsCount: true,
    //     createdAt: true,
    //     requestHistorySize: 0,
    //     devices: false,
    // },
    // userContext: {
    //     prev: {
    //         size: 1,
    //         request: {
    //             intent: true,
    //             state: true,
    //             inputs: true,
    //             timestamp: true,
    //         },
    //         response: {
    //             speech: true,
    //             reprompt: true,
    //             state: true,
    //         },
    //     },
    // },
    // analytics: {
    //     intentsToSkip: [],
    //     usersToSkip: [],
    //     services: {},
    // },
    // alexaSkill: {},
    // googleAction: {},
    //
    //
    //
    //






    plugins: {
        Router: {
            intentMap: {}
        },
        JovoDebugger: {
        },
        MySQL: {
            table: 'users',
            connection: {
                host     : 'localhost',
                user     : 'root',
                password : '',
                database : 'test'
            }
        },
    },
    Db: {
        MySQL: {
            table: 'users',
            connection: {
                host     : 'localhost',
                user     : 'root',
                password : '',
                database : 'test'
            }
        },
        Email: {
            from: ,
            awsConfig: {
                secretkey,
                accessKey
            }
        }

    },
    Platforms: {
        Alexa: {

        }
    }

};
