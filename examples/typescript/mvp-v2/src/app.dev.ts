import { app } from './app';
import { FileDb } from '@jovotech/db-filedb';

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
    pathToFile: './db/db.json',
  }),
);

export * from './server.express';
