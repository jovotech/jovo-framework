# App Logic

In this section, you will learn more about the essentials of building the logic of your Jovo Voice App.

* [Basic Concepts](#basic-concepts)
  * [Handler](#handler)
  * [Routing](#routing)
  * [Data](#data)
  * [Output](#output)


## Basic Concepts

In the following sections, you will learn about [handling](#handler) and [routing](#routing) through intents and states, accessing [user input and data](#data), and crafting speech and visual [output](#output). 

### Handler

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

You can also define seperate handlers for each platform to overwrite specific intents and states for platform specific app logic.

```javascript
app.setAlexaHandler({
    'HelloWorldIntent': function() {
        this.tell('Hello Alexa user');
    }
});

app.setGoogleActionHandler({
    'HelloWorldIntent': function() {
        this.tell('Hello Google user');
    }
});
```

### Routing

In section [App Logic > Routing](./01_routing), the concepts of intents and states are introduced, and how to route through them in the app's flow.


### Data

In section [App Logic > Data](./02_data), user input (slots and parameters) and user specific data are covered.


### Output

In section [App Logic > Output](./03_output), you can learn more about how to craft speech, audio, and visual responses.

