'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const {App} = require('jovo-framework');
const {JovoDebugger} = require('jovo-plugin-debugger');
const {FileDb} = require('jovo-db-filedb');
const {Lex} = require('jovo-platform-lex');

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
  //Launch Intent won't be call by Lex test console.
  //your first prompt must be define in the web interface.
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
  /*
  * In Lex console, create an intent MyNameIsIntent
  * Add the prompt : my name is {name}
  * Add a slot call "name" of type AMAZON.Person.
  * */
  MyNameIsIntent() {
    if(this.$inputs.name !== undefined && this.$inputs.name.value !== undefined){
      return this.ask('your name is ' + this.$inputs.name.value);
    }
    this.ask('missing name value. what\'s your name ?');
  },
});

module.exports.app = app;
