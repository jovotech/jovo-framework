import { app } from './app';

export const handler = async (event: any, context: any, callback: Function) => {
  // await app.bootstrap();
  const response = await app.handle(event);
  return response;
};
