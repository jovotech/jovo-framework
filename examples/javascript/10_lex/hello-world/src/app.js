'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { Lex } = require('jovo-platform-lex');

const app = new App();

app.use(
    new Lex(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?');
        if (this.isLexBot()) {
            this.$lexBot.showStandardCard('Hello World! What\'s your name ?',
              'card subtitle',
              'http://via.placeholder.com/350x150?text=Basic+Card',
              'https://www.jovo.tech', [
                  {
                      text: 'bob',
                      value: 'bob'
                  },
                  {
                      text: 'bobby',
                      value: 'bobby'
                  }
              ])
        }

    },

    MyNameIsIntent() {
      this.ask('todo');
    },
});

module.exports.app = app;
