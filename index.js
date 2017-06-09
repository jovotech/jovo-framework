/**
 * Created by Alex on 02-Jun-17.
 */

const Jovo = require('./lib/jovo').Jovo;
const FilePersistence = require('./lib/filePersistence').FilePersistence;

let express = require('express');
let bodyParser = require('body-parser');
let server = express();
server.use(bodyParser.json());

module.exports.Webhook = server;
module.exports.Jovo = new Jovo();
module.exports.FilePersistence = FilePersistence;