import { app } from './app';
import './server.express';
import { Alexa } from '@jovotech/platform-alexa-tmp';
app.use(new Alexa());

export { app };
