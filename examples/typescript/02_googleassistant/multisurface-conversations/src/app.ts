
import { App } from 'jovo-framework';


import {GoogleAssistant} from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
);


app.setHandler({
    async LAUNCH() {
        const availableSurfaces = this.$googleAction!.getAvailableSurfaces();

        if (availableSurfaces.includes('actions.capability.SCREEN_OUTPUT')) {
            this.$googleAction!.newSurface(
                ['actions.capability.SCREEN_OUTPUT'],
                'Let\'s move you to a screen device for cards and other visual responses',
                'Title');
        }
    },
    ON_NEW_SURFACE() {

        if (this.$googleAction!.isNewSurfaceConfirmed()) {
            this.tell('Hello Smartphone');
        } else {
            this.tell('Hello Speaker');
        }
    }
});

export {app};
