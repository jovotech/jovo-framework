import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import { Log } from 'jovo-core';

// Create a new express application instance
const server: express.Application = express();

server.jovoApp = undefined;
server.use(bodyParser.json());

server.listen = function () {
    if (server.jovoApp) {
        server.jovoApp.initWebhook();
    }
    const s = http.createServer(this);
    // @ts-ignore
    return s.listen.apply(s, arguments);
};

const verifiedServer: express.Application = express();
verifiedServer.jovoApp = undefined;

verifiedServer.listen = function () {
    try {
        const verifier = require('alexa-verifier-middleware'); // tslint:disable-line:no-implicit-dependencies

        if (verifiedServer.jovoApp) {
            verifiedServer.jovoApp.initWebhook();
        }
        const router = express.Router();
        verifiedServer.use(router);
        router.use('/webhook_alexa', verifier);
        router.use('/webhook_alexa', bodyParser.json());
        router.use('/webhook', bodyParser.json());

        const httpServer = http.createServer(this);
        // @ts-ignore
        return httpServer.listen.apply(httpServer, arguments); // eslint-disable-line
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            Log.warn();
            Log.warn('  Please install module alexa-verifier-middleware');
            Log.warn('  $ npm install alexa-verifier-middleware');
            Log.warn();
        } else {
            Log.error(error);
        }
    }
};

export { server, verifiedServer };
