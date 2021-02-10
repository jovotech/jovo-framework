"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const https = require("https");
const jovo_core_1 = require("jovo-core");
// Create a new express application instance
const server = express();
exports.server = server;
server.jovoApp = undefined;
server.ssl = undefined;
server.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }), bodyParser.json({ limit: '5mb' }));
const corsJest = (req, res, next) => {
    if (req.headers['jovo-test'] ||
        (req.headers['access-control-request-headers'] &&
            req.headers['access-control-request-headers'].includes('jovo-test'))) {
        res.header('Access-Control-Allow-Origin', 'http://localhost');
        res.header('Access-Control-Allow-Methods', 'OPTIONS,POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, jovo-test');
    }
    next();
};
server.use(corsJest);
server.listen = function () {
    if (server.jovoApp) {
        server.jovoApp.initWebhook();
    }
    const s = server.ssl ? https.createServer(server.ssl, this) : http.createServer(this);
    // @ts-ignore
    return s.listen.apply(s, arguments);
};
const verifiedServer = express();
exports.verifiedServer = verifiedServer;
verifiedServer.jovoApp = undefined;
verifiedServer.ssl = undefined;
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
        const httpServer = verifiedServer.ssl
            ? https.createServer(verifiedServer.ssl, this)
            : http.createServer(this);
        // @ts-ignore
        return httpServer.listen.apply(httpServer, arguments); // eslint-disable-line
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            jovo_core_1.Log.warn();
            jovo_core_1.Log.warn('  Please install module alexa-verifier-middleware');
            jovo_core_1.Log.warn('  $ npm install alexa-verifier-middleware');
            jovo_core_1.Log.warn();
        }
        else {
            jovo_core_1.Log.error(error);
        }
    }
};
//# sourceMappingURL=server.js.map