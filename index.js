/**
 * Created by Alex on 02-Jun-17.
 */

const Jovo = require('./lib/jovo').Jovo;
const FilePersistence = require('./lib/integrations/db/filePersistence').FilePersistence;
const DynamoDb = require('./lib/integrations/db/dynamoDb').DynamoDb;
const http = require('http');
let express = require('express');
let bodyParser = require('body-parser');


let server = express();
server.use(bodyParser.json());


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
        // response.setTimeout(50);

        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function() {
            let result = JSON.parse(str);
            if (result.tunnels.length > 0) {
                console.log('This is your webhook url: ' + result.tunnels[0].public_url+'/webhook');
            }
        });
    }).setTimeout(50).on('error', function(err) {

    });


    let server = http.createServer(this);
    return server.listen.apply(server, arguments); // eslint-disable-line
};


module.exports.Webhook = server;
module.exports.Jovo = new Jovo();
module.exports.FilePersistence = FilePersistence;
module.exports.DynamoDb = DynamoDb;

