/**
 * Created by Alex on 02-Jun-17.
 */

const Jovo = require("./lib/jovo").Jovo;


let express = require('express')
let bodyParser = require('body-parser');
let server = express();
server.use(bodyParser.json());

module.exports.Webhook = server;
module.exports.App = new Jovo();