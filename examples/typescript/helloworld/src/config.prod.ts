import { app } from './app';
import { config } from '@jovotech/framework';
import { JovoDebugger } from '@jovotech/plugin-debugger';

/**
 * DEFAULT CONFIG
 *
 * Active for all stages
 */

app.config({
  logging: true,
  plugins: [new Alexa(), new GoogleAssistant()],
});

/**
 * Config for local development
 */
if (process.env.JOVO_STAGE === 'local') {
  app.config({
    plugins: [new JovoDebugger(), new FileDb()],
  });
}

/**
 * Config in production
 */
if (process.env.JOVO_STAGE === 'prod') {
  app.config({
    plugins: [new DynamoDb(), new SlackErrorPlugin()],
  });
}
