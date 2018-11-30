# User Input

In this section, you will learn how to deal with entities and slot values provided by your users.

* [Introduction to User Input](#introduction-to-user-input)
* [How to Access Input](#how-to-access-input)
  * [Input as Parameter](#input-as-parameter)
  * [getInput | getInputs](#getinput)
  * [inputMap](#inputmap)

## Introduction to User Input

> If you're new to voice applications, you can learn more about general principles like slots and entities here: [Getting Started > Voice App Basics](../../01_getting-started/voice-app-basics.md './voice-app-basics').

We call user input any additional information your user provides besides an `intent`. On Amazon Alexa, input is usually called a `slot`, on Google Assistant/Dialogflow an `entity` or `parameter`.


## How to Access Input

 > With the update to Jovo v1.0, we changed the way you can access input values. Please read more below, or take a look at our [migration document](https://www.jovo.tech/blog/v1-migration-guide/).

There are two ways to get the inputs provided by a user: either using `this.$inputs`, or by using the [`getInput`](#getinput) method.

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


### $inputs

You can access the inputs using the `$inputs` object, which will store all the inputs of the requested intent:

```javascript
app.setHandler({

    // Other Intents and States

    SomeIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', I like ' + this.$inputs.city.value + ' too!');
    },
});
```

### getInput

You can either access the values of all user inputs with the `getInputs` method, or get specific values directly with `getInput('inputName')`.

```javascript
app.setHandler({

    // Other Intents and States

    SomeIntent() {
        // Get all inputs
        let inputs = this.$inputs;

        // Get input for a single slot or entity
        let value = this.$inputs.inputName.value;

        // Do something
    }

    // Other Intents and States
});
```

### inputMap

Similar to [`intentMap`](../01_routing/#intentmap './routing#intentmap'), there are cases where it might be valuable (due to naming conventions on different platforms or built-in input types) to map different input entities to one defined Jovo `inputName`. You can add this to the configuration section of your voice app:

```javascript
let myInputMap = { 
    'incomingInputName' : 'mappedInputName',
};

// Using the constructor
const config = {
    inputMap: myInputMap,
    // Other configurations
};

// Using the setter
app.setInputMap(myInputMap);
```

Example: You want to ask your users for their name and created a slot called `name` on the Amazon Developer Platform. However, on Dialogflow, you decided to use the pre-defined entity `given-name`. You can now use an inputMap to match incoming inputs from Alexa and Google.

```javascript
// Map Dialogflow standard parameter given-name with name
const config = {
    inputMap: { 'given-name' : 'name', },
    // Other configurations
};
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


<!--[metadata]: {"description": "Learn how to deal with entities and slot values provided by your users.",
		            "route": "routing/user-input"}-->
