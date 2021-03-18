import { app } from './app';
export const handler = async (event, context, callback) => {
  // await app.bootstrap();
  await app.handle(event);
};
