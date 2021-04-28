import { app } from './app';

/*
|--------------------------------------------------------------------------
| LAMBDA CONFIGURATION
|--------------------------------------------------------------------------
|
| Used to run the app on AWS Lambda
| Learn more here: www.jovo.tech/docs/server/lambda
|
*/

export const handler = async (event: any, context: any, callback: Function) => {
  await app.handle(event);
};
