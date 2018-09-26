'use strict';

const Jovo = require('./lib/jovo').Jovo;
const FilePersistence = require('./lib/integrations/db/filePersistenceV2').FilePersistence;
const DynamoDb = require('./lib/integrations/db/dynamoDb').DynamoDb;
const WebhookTest = require('./lib/tools/webhookTest').WebhookTest;
const RequestBuilderAlexaSkill = require('./lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;
const App = require('./lib/app').App;

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

let server = express();
server.use(bodyParser.json());

// check for running ngrok tunnel
server.listen = function listen() {
    if (process.argv.indexOf('--bst-proxy') === -1 &&
        process.argv.indexOf('--jovo-webhook') === -1) {
        showNgrokUrl();
    }

    // Helper for fast debugging
// simple intent and launch requests can be tested
// TODO: work in progress

    // if (process.argv.indexOf('--debug') > -1) {
    // using parameters
    if (process.argv.indexOf('--bst-proxy') > -1 || process.argv.indexOf('--jovo-webhook') > -1) {
        if (process.argv.indexOf('--intent') > -1 || process.argv.indexOf('--launch') > -1) {
            console.log('\n\nInfo: Fast debugging does not work with proxy.\n\n');
        }
    } else if (process.argv.indexOf('--intent') > -1 || process.argv.indexOf('--launch') > -1 || process.argv.indexOf('--file') > -1) {
        try {
            let program = require('commander');
            let parameters = [];
            let sessions = [];
            program
                .option('-f, --file [file]', 'path to file')
                .option('-i, --intent [intentName]', 'intent name')
                .option('-l, --launch', 'launch')
                .option('-w, --webhook', 'webhook')
                .option('-s, --state [state]', 'state')
                .option('-l, --locale [locale]', 'locale')
                .option('-p, --parameter [value]', 'A repeatable value', function(val) {
                    parameters.push(val);
                }, [])
                .option('-e, --session [value]', 'Session variables', function(val) {
                    sessions.push(val);
                }, [])
                .parse(process.argv);
            let webhookTest = new WebhookTest();

            if (program.intent) {
                let intent = RequestBuilderAlexaSkill
                    .intentRequest()
                    .setIntentName(program.intent);
                if (program.state) {
                    intent.addSessionAttribute('STATE', program.state);
                }
                if (program.locale) {
                    intent.setLocale(program.locale);
                }
                if (parameters.length > 0) {
                    for (let i = 0; i < parameters.length; i++) {
                        let parameter = parameters[i].split('=');
                        if (parameter.length !== 2) {
                            console.log('Invalid parameter: ' + parameters[i]);
                        } else {
                            intent.addSlot(parameter[0], parameter[1]);
                        }
                    }
                }
                if (sessions.length > 0) {
                    for (let i = 0; i < sessions.length; i++) {
                        let session = sessions[i].split('=');
                        if (session.length !== 2) {
                            console.log('Invalid session: ' + sessions[i]);
                        } else {
                            intent.addSessionAttribute(session[0], session[1]);
                        }
                    }
                }
                webhookTest
                    .testIntent(intent)
                    .then((response) => {
                    });
            }
            if (program.launch) {
                let launchRequest = RequestBuilderAlexaSkill
                    .launchRequest();
                if (program.locale) {
                    launchRequest.setLocale(program.locale);
                }
                webhookTest
                    .testLaunch(launchRequest)
                    .then((response) => {
                    }).catch((error) => {
                    console.log(error);
                });
            }

            if (program.file) {
                let file = program.file.replace(/\\/g, '/');

                let alexaRequest = RequestBuilderAlexaSkill
                    .alexaRequest(require(file));
                webhookTest
                    .testRequest(alexaRequest)
                    .then((response) => {
                    }).catch((error) => {
                    console.log(error);
                });
            }
        } catch (err) {
            console.log(err);
            console.log('\nPlease install commander: npm install commander\n');
        }
    }
    // }
    let server = http.createServer(this);
    return server.listen.apply(server, arguments); // eslint-disable-line
};


/**
 * Logs local ngrok url on port 3000
 */
function showNgrokUrl() {
    let options = {
        host: 'localhost',
        port: 4040,
        path: '/api/tunnels',
        headers: {
            accept: 'application/json',
        },
    };

    http.get(options, function(response) {
        let str = '';

        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function() {
            let result = JSON.parse(str);

            // find https tunnel
            for (let i = 0; i < result.tunnels.length; i++) {
                let tunnel = result.tunnels[i];
                if (tunnel.proto === 'https' && tunnel.config.addr === 'localhost:3000') {
                    if (process.argv.indexOf('--bst-proxy') === -1) {
                        console.log('This is your webhook url: ' + result.tunnels[i].public_url + '/webhook');
                    }
                }
            }
        });
    }).setTimeout(50).on('error', function(err) {

    });
}


const verifiedServer = express();
verifiedServer.listen = function() {
    try {
        const verifier = require('alexa-verifier-middleware');
        let router = express.Router(); //eslint-disable-line
        verifiedServer.use(router);
        router.use(verifier);
        router.use(bodyParser.json());
        let server = http.createServer(this);
        return server.listen.apply(server, arguments); // eslint-disable-line
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log();
            console.log('  Please install module alexa-verifier-middleware');
            console.log('  $ npm install alexa-verifier-middleware');
            console.log();
        } else {
            console.log(error);
        }
    }
};
module.exports.Webhook = server;
module.exports.WebhookVerified = verifiedServer;
// module.exports.Jovo = new Jovo();
module.exports.GoogleAction = require('./lib/platforms/googleaction/googleAction').GoogleAction;
module.exports.AlexaSkill = require('./lib/platforms/alexaSkill/alexaSkill').AlexaSkill;
module.exports.Plugin = require('./lib/integrations/plugin').Plugin;
module.exports.FilePersistence = FilePersistence;
module.exports.DynamoDb = DynamoDb;
module.exports.JovoClazz = Jovo;
module.exports.SpeechBuilder = require('./lib/platforms/speechBuilder').SpeechBuilder;
module.exports.TestSuite = require('./lib/tools/testSuite');

module.exports.util = require('./lib/util');
// module.exports.App = Jovo;
module.exports.App = App;


