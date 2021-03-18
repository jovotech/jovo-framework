import { app } from './app';
import { Alexa } from 'jovo-platform-alexa';
import './server.express';
app.use(new Alexa());

export { app };
