'use strict';

const Jovo = require('./lib/jovo').Jovo;
const FilePersistence = require('./lib/integrations/db/filePersistence').FilePersistence;
const DynamoDb = require('./lib/integrations/db/dynamoDb').DynamoDb;
const WebhookTest = require('./lib/tools/webhookTest').WebhookTest;
const RequestBuilderAlexaSkill = require('./lib/platforms/alexa/request/util/requestBuilder').RequestBuilder;

const http = require('http');
const express = require('express');
const verifier = require('alexa-verifier-middleware');
const bodyParser = require('body-parser');


let server = express();
server.use(bodyParser.json());

const verifiedServer = express();
const alexaRouter = express.Router(); // eslint-disable-line
verifiedServer.use(alexaRouter);
alexaRouter.use(verifier);
alexaRouter.use(bodyParser.json());

// check for running ngrok tunnel
server.listen = function listen() {
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
                        console.log('This is your webhook url: ' + result.tunnels[i].public_url+'/webhook');
                    }
                }
            }
        });
    }).setTimeout(50).on('error', function(err) {

    });


    let server = http.createServer(this);
    return server.listen.apply(server, arguments); // eslint-disable-line
};
// Helper for fast debugging
// simple intent and launch requests can be tested
// TODO: work in progress

if (process.argv.length > 2) {
    // using parameters
    if (process.argv.indexOf('--bst-proxy') > -1) {
        if (process.argv.indexOf('--intent') > -1 || process.argv.indexOf('--launch') > -1) {
            console.log('\n\nInfo: Fast debugging does not work with proxy.\n\n');
        }
    } else if (process.argv.indexOf('--intent') > -1 || process.argv.indexOf('--launch') > -1) {
        try {
            let program = require('commander');
            let parameters = [];
            let sessions = [];
            program
                .option('-i, --intent [intentName]', 'intent name')
                .option('-l, --launch', 'launch')
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
                            console.log('Invalid parameter: '+ parameters[i]);
                        } else {
                            intent.addSlot(parameter[0], parameter[1]);
                        }
                    }
                }
                if (sessions.length > 0) {
                    for (let i = 0; i < sessions.length; i++) {
                        let session = sessions[i].split('=');
                        if (session.length !== 2) {
                            console.log('Invalid session: '+ sessions[i]);
                        } else {
                            intent.addSessionAttribute(session[0], session[1]);
                        }
                    }
                }
                webhookTest
                    .testIntent(intent)
                    .then((response) => { });
            }
            if (program.launch) {
                let launchRequest = RequestBuilderAlexaSkill
                    .launchRequest();
                if (program.locale) {
                    launchRequest.setLocale(program.locale);
                }
                webhookTest
                    .testLaunch(launchRequest)
                    .then((response) => {}).catch((error) => {
                    console.log(error);
                });
            }
        } catch (err) {
            console.log(err);
            console.log('\nPlease install commander: npm install commander\n');
        }
    }
}


module.exports.Webhook = server;
module.exports.WebhookVerified = verifiedServer;
module.exports.Jovo = new Jovo();
module.exports.GoogleAction = require('./lib/platforms/googleaction/googleAction').GoogleAction;
module.exports.AlexaSkill = require('./lib/platforms/alexa/alexaSkill').AlexaSkill;

module.exports.FilePersistence = FilePersistence;
module.exports.DynamoDb = DynamoDb;
module.exports.JovoClazz = Jovo;
module.exports.App = Jovo;


