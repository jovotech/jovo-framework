# App Logic

In this section, you will learn more about the essentials of building the logic of your Jovo Voice App.

* [Overview](#overview)
* [Routing](#routing)
* [Data](#data)
* [Output](#output)


## Overview

The `handlers` variable is the main building block of your voice app. This is where the logic happens.

For example, in the sample voice app [`index.js`](https://github.com/jovotech/jovo-sample-voice-app-nodejs/blob/master/index.js) file, the Voiec App Logic part looks like this:

```javascript
// Configurations above

const handlers = {

    'LAUNCH': function() {
        app.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        app.tell('Hello World!');
    },
};
```

In the following sections, you will learn how to [route](#routing) through intents and states, handling [user input and data](#data), and crafting speech and visual [output](#output). 

## Routing

In section [App Logic > Routing](/01_routing), the concepts of intents and states are introduced, and how to route through them in the app's flow.


## Data

In section [App Logic > Data](/02_data), user input (slots and parameters) and user specific data are covered.


## Output

In section [App Logic > Output](/02_data), you can learn more about how to craft speech, audio, and visual responses.

