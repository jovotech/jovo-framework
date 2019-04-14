
import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);


app.setHandler({

    async LAUNCH() {
        return this.toIntent('StartVideoIntent');
    },
    async StartVideoIntent() {
        this.$alexaSkill!.showVideo('https://url.to.video', 'Any Title', 'Any Subtitle').tell('Hallo');
    }
});


export {app};
