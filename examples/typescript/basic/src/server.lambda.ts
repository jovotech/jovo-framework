import { app } from './app';
import { Lambda, Context, Callback, APIGatewayEvent } from '@jovotech/server-lambda';

/*
|--------------------------------------------------------------------------
| LAMBDA CONFIGURATION
|--------------------------------------------------------------------------
|
| Used to run the app on AWS Lambda
| Learn more here: www.jovo.tech/docs/server/lambda
|
*/

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  await app.initialize();
  await app.handle(new Lambda(event, context, callback));
};
