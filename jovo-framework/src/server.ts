import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Create a new express application instance
const server: express.Application = express();

server.jovoApp = undefined;
server.use(bodyParser.json());

server.listen = function() {
    if (server.jovoApp) {
        server.jovoApp.initWebhook();
    }
    const s = http.createServer(this);
    // @ts-ignore
    return s.listen.apply(s, arguments); // eslint-disable-line
};

const verifiedServer: express.Application = express();
verifiedServer.jovoApp = undefined;

verifiedServer.listen = function() {
    try {
        const verifier = require('alexa-verifier-middleware');

        if (verifiedServer.jovoApp) {
            verifiedServer.jovoApp.initWebhook();
        }
        const router = express.Router();
        verifiedServer.use(router);
        router.use('/webhook_alexa', verifier);
        router.use('/webhook_alexa', bodyParser.json());
        router.use('/webhook', bodyParser.json());

        const server = http.createServer(this);
        // @ts-ignore
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

export {server, verifiedServer};
