import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';

import { Log } from 'jovo-core';

// Create a new express application instance
const server: express.Application = express();

server.jovoApp = undefined;
server.ssl = undefined;
server.use(
  bodyParser.urlencoded({ extended: true, limit: '5mb' }),
  bodyParser.json({ limit: '5mb' }),
);

server.listen = function() {
  if (server.jovoApp) {
    server.jovoApp.initWebhook();
  }
  const s = server.ssl ? https.createServer(server.ssl, this) : http.createServer(this);

  // @ts-ignore
  return s.listen.apply(s, arguments);
};

const verifiedServer: express.Application = express();
verifiedServer.jovoApp = undefined;
verifiedServer.ssl = undefined;

verifiedServer.listen = function() {
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

    const httpServer = verifiedServer.ssl
      ? https.createServer(verifiedServer.ssl, this)
      : http.createServer(this);
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
