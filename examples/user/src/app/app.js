const {App, Alexa, GoogleAssistant, Jovo} = require('jovo-framework');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa()
);


app.setHandler({

    async LAUNCH() {
        this.$user.data.foo = 'bar';
        console.log(this.$user.metaData.createdAt);
        return this.tell('Data saved');
    },
});

module.exports.app = app;
