
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
        // return this.toIntent('ProgressiveResponseWithCallback');
        return this.toIntent('ProgressiveResponseWithPromise');


    },
    async ProgressiveResponseWithCallback() {
        this.$alexaSkill!.progressiveResponse('Processing your request', () => {
            setTimeout( () => {
                this.alexaSkill().progressiveResponse('Still processing');
            }, 1500);
        });
        await dummyApiCall(2000);

        this.tell('Text after API call');
    },
    async ProgressiveResponseWithPromise() {
        this.$alexaSkill!.progressiveResponse('Processing')!
            .then(() => {
                this.$alexaSkill!.progressiveResponse('Still processing');
            });
        await dummyApiCall(2000);

        this.tell('Text after API call');
    },
});


function dummyApiCall(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}


export {app};
