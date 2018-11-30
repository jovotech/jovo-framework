const {App, Alexa, GoogleAssistant, Jovo} = require('jovo-framework');
const {Plugin} = require('jovo-core');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa()
);


class EventListenerPlugin extends Plugin {
    install(app) {
        console.log('INSTALL');
        app.on('after.request', (handleRequest) => {
            console.log('after request event');
        });

        app.on('before.response', (handleRequest) => {
            console.log('before response event');
        });
    }
}



class MiddlewareAuthPlugin {
    install(app) {
        app.middleware('request').use(this.auth.bind(this));
    }

    auth(handleRequest) {
        if (!handleRequest.host.headers['auth-code']) {
            // throw new Error('Missing auth code');
        }
    }
}


app.use(new EventListenerPlugin());
app.use(new MiddlewareAuthPlugin());



app.middleware('after.platform.init').use( async (handleRequest) => {
    return new Promise((resolve) => {
        // fake api call
        setTimeout(() => {
            handleRequest.jovo.$data.foo = 'bar';
            resolve();
        }, 2000);
    });
});

app.setHandler({

    async LAUNCH() {
        this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        console.log(this.$data.foo);
        this.tell('Hello World!');
    }
});




module.exports.app = app;
