import { App, ComponentDeclaration } from '@jovotech/framework';

import { StandardComponent } from './StandardComponent';
import { Alexa } from '@jovotech/platform-alexa';

const app = new App();
app.use(new Alexa());

app.useComponents(new ComponentDeclaration(StandardComponent, { name: 'DeclarationRoot' }));

// const data = fs.readFileSync(process.cwd() + '/data/data.json', 'utf8');
export { app };
