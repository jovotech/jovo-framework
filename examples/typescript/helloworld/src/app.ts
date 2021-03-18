import { App, ComponentDeclaration } from 'jovo-core';

import { Alexa } from 'jovo-platform-alexa';
import { StandardComponent } from './StandardComponent';
import * as fs from 'fs';

const app = new App();
app.use(new Alexa());

app.useComponents(new ComponentDeclaration(StandardComponent, { name: 'DeclarationRoot' }));

// const data = fs.readFileSync(process.cwd() + '/data/data.json', 'utf8');
export { app };
