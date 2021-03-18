import express from 'express';
import { app } from './app.dev';
// Create a new express app instance
const server: express.Application = express();

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
