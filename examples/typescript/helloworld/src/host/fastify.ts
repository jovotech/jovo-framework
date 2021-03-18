import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { app } from '../app';
const server: FastifyInstance = Fastify();

server.post('/webhook', async (request, reply) => {
  await app.handle(request.body as any);
  return { foo: 'bar!' };
});

const start = async () => {
  try {
    await server.listen(3000);

    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;

    console.log(`server listening on ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
