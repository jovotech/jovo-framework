
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);
app.setHandler({

    async LAUNCH() {
        const foo = false;
        const bar = true;
        this.$speech
            .addText('HelloWorld')
            .addBreak('100ms', false)
            .addText('Foo', foo)
            .addText('Bar', bar)
            .addText(['Text1', 'Text2', 'Text3'])
            .addBreak(['500ms', '1s'])
            .addText('Good Bye.');

        return this.tell(this.$speech);

    },
});


export {app};
