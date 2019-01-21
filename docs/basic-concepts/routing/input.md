# Input

In this section, you will learn how to deal with entities and slot values provided by your users.

* [Introduction to User Input](#introduction-to-user-input)
* [How to Access Input](#how-to-access-input)
* [inputMap](#inputmap)

## Introduction to User Input

> [Learn how to add inputs to the Jovo Language Model here](../model '../model').

We call user input any additional information your user provides besides an `intent`. On Amazon Alexa, input is usually called a `slot`, on Google Assistant/Dialogflow an `entity` or `parameter`.


## How to Access Input

 > With the update to Jovo v2, we changed the way you can access input values. Please read more below, or take a look at our [migration document](../../getting-started/installation/v1-migration.md '../installation/v1-migration').

You can access the complete object of inputs with `this.$inputs`, and a specific input by its name: `this.$inputs.name`.

Each input is an object which looks like this:

```javascript
{
  name: 'inputName',
  value: 'inputValue',
  key: 'mappedInputValue', // may differ from value if synonyms are used in language model
}
```
For example, if we want to access the value of an input `name` provided by the user, we can do so by using `name.value`.

Other parameters (like `id` or platform specific elements) can be found in the object as well.


## inputMap

Similar to [`intentMap`](./intents.md#intentmap './intents#intentmap'), there are cases where it might be valuable (due to naming conventions on different platforms or built-in input types) to map different input entities to one defined Jovo `inputName`. You can add this to the configuration section of your voice app:

```javascript
// config.js file
inputMap: {
    'incomingInputName' : 'mappedInputName',
},
```

Example: You want to ask your users for their name and created a slot called `name` on the Amazon Developer Platform. However, on Dialogflow, you decided to use the pre-defined entity `given-name`. You can now use an inputMap to match incoming inputs from Alexa and Google.

```javascript
// Map Dialogflow standard parameter given-name with name
inputMap: {
    'given-name' : 'name',
},
```

With this, you can use `name` to get the input with both Alexa and Google requests:

```javascript
app.setHandler({

    // Other Intents and States

    MyNameIsIntent() {
        this.tell('Hello ' + this.$inputs.name.value + '!');
    }

    // Other Intents and States
});
```


<!--[metadata]: {"description": "Learn how to deal with entities and slot values provided by your users.", "route": "routing/input"}-->
