import { app } from './app';
import { Lambda, Context, Callback, APIGatewayEvent } from '@jovotech/server-lambda';
export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  // await app.bootstrap();
  await app.handle(new Lambda(event, context, callback));
};
