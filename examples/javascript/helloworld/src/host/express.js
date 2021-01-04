import express from 'express';
// Create a new express app instance
const server = express();

import {app} from '../app';

const port = process.env.JOVO_PORT || 3000;

server.listen(port, () => {
    console.info(`Local server listening on port ${port}.`);
});

server.post('/webhook', async (req, res) => {
    await app.handle(req.body);
});
