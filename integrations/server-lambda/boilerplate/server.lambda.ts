import { APIGatewayEvent, Callback, Context, Lambda } from '@jovotech/server-lambda';
import { app } from './app';

/*
|--------------------------------------------------------------------------
| LAMBDA CONFIGURATION
|--------------------------------------------------------------------------
|
| Used to run the app on AWS Lambda
| Learn more here: https://www.jovo.tech/marketplace/server-lambda
|
*/

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  await app.initialize();
  await app.handle(new Lambda(event, context, callback));
};
