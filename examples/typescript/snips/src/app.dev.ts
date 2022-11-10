import { FileDb } from '@jovotech/db-filedb';
import { JovoDebugger } from '@jovotech/plugin-debugger';
import { SnipsNlu } from '@jovotech/nlu-snips';
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
    nlu: new SnipsNlu(),
  }),
);

export * from './server.express';
