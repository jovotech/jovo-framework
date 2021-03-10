import express from 'express'
// Create a new express app instance
const server: express.Application = express();

import { app } from './app';

const port = process.env.JOVO_PORT || 3000;

(async () => {
  await app.initialize();

  server.listen(port, () => {
    console.info(`Local server listening on port ${port}.`);
  });

  server.post('/webhook', async (req: Express.Request, res: Express.Response) => {
    await app.handle((req as any).body);
  });
})();
