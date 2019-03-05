import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Create a new express application instance
const server: express.Application = express();

// @ts-ignore
server.jovoApp = undefined;
// @ts-ignore
server.use(bodyParser.json());

// @ts-ignore
server.listen = function () {
    // @ts-ignore
    if (server.jovoApp) {
        // @ts-ignore
        server.jovoApp.initWebhook();
    }
    const s = http.createServer(this);
    // @ts-ignore
    return s.listen.apply(s, arguments); // eslint-disable-line
};

const verifiedServer: express.Application = express();
// @ts-ignore
verifiedServer.listen = function () {
    try {
        const verifier = require('alexa-verifier-middleware');

        const router = express.Router();
        // @ts-ignore
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

export { server, verifiedServer };
