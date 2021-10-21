import {app} from './app';
import {Lambda} from '@jovotech/server-lambda';

export const handler = async (event, context, callback) => {
  await app.initialize();
  await app.handle(new Lambda(event, context, callback));
};
