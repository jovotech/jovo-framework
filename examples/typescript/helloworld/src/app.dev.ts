import { app } from './app';
import './server.express';
import { Alexa } from '@jovotech/platform-alexa';
app.use(new Alexa());

export { app };
