import {app} from "./app";

export const handler = async (event, context, callback) => {
  await app.bootstrap();
  const response = await app.handle(event);
  return response;
};