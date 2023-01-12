import { FileDb } from '@jovotech/db-filedb';
import { JovoDebugger } from '@jovotech/plugin-debugger';
import { app } from './app';

/*
|--------------------------------------------------------------------------
| STAGE CONFIGURATION
|--------------------------------------------------------------------------
|
| This configuration gets merged into the default app config
| Learn more here: www.jovo.tech/docs/staging
|
*/
app.use(
  new FileDb({
    pathToFile: '../db/db.json',
  }),
  new JovoDebugger({
    ignoredProperties: ['$app', '$handleRequest', '$platform', '$inbox'],
  }),
);

export * from './server.express';
