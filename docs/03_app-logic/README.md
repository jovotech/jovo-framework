# App Logic

In this section, you will learn more about the essentials of building the logic of your Jovo Voice App.

* [Overview](#overview)
* [Basic Concepts](#basic-concepts)
  * [Routing](#routing)
  * [Data](#data)
  * [Output](#output)


## Overview

The `handlers` variable is the main building block of your voice app. This is where the logic happens.

```javascript
app.setHandler({

    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.tell('Hello World!');
    },
});
```


## Basic Concepts

In the following sections, you will learn how to [route](#routing) through intents and states, handling [user input and data](#data), and crafting speech and visual [output](#output). 

### Routing

In section [App Logic > Routing](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/01_routing), the concepts of intents and states are introduced, and how to route through them in the app's flow.


### Data

In section [App Logic > Data](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/02_data), user input (slots and parameters) and user specific data are covered.


### Output

In section [App Logic > Output](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output), you can learn more about how to craft speech, audio, and visual responses.

