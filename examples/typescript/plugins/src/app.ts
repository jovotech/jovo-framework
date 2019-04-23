
import { App } from 'jovo-framework';
import {HandleRequest, Plugin} from 'jovo-core';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import {MiddlewareAuthPlugin} from "./Plugin";


const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);

class EventListenerPlugin implements Plugin {
    install(app: App) {
        console.log('INSTALL');
        app.on('after.request', (handleRequest:HandleRequest) => {
            console.log('after request event');
        });

        app.on('before.response', (handleRequest:HandleRequest) => {
            console.log('before response event');
        });
    }
}





app.use(new EventListenerPlugin());
app.use(new MiddlewareAuthPlugin());



app.middleware('after.platform.init')!.use( async (handleRequest: HandleRequest) => {
    return new Promise((resolve) => {
        // fake api call
        setTimeout(() => {
            if (handleRequest.jovo) {
                handleRequest.jovo.$data.foo = 'bar';
                resolve();
            }
        }, 2000);
    });
});

app.setHandler({

    async LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        console.log(this.$data.foo);
        this.tell('Hello World!');
    }
});


export {app};
