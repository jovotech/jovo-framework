import {App} from 'jovo-framework';


import {JovoDebugger} from 'jovo-plugin-debugger';
import {Lex} from 'jovo-platform-lex';
import {FileDb} from 'jovo-db-filedb';


const app = new App();

app.use(
  new JovoDebugger(),
  new FileDb(),
  new Lex()
);

process.env.JOVO_LOG_LEVEL = 'VERBOSE';

app.setHandler({
  //Launch Intent won't be call by Lex test console.
  //your first prompt must be define in the web interface.
  LAUNCH() {
    return this.toIntent('HelloWorldIntent');
  },

  HelloWorldIntent() {
    this.ask('Hello World! What\'s your name?');
  },
  /*
  * In Lex console, create an intent MyNameIsIntent
  * Add the prompt : my name is {name}
  * Add a slot call "name" of type AMAZON.Person.
  * */
  MyNameIsIntent() {
    if ( this.$inputs.name !== undefined && this.$inputs.name.value !== undefined ) {
      return this.ask('your name is ' + this.$inputs.name.value);
    }
    this.ask('missing name value. what\'s your name ?');
  },
});


export {app};
