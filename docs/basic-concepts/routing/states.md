# States

In this section, you will learn more about how to use intents and states to route your users through your voice app.

* [Introduction](#introduction)
* [followUpState](#followupstate)
* [Nested States](#nested-states)
* [Remove a State](#remove-a-state)


## Introduction

For simple voice apps, the structure to handle the logic is quite simple:

```javascript
app.setHandler({

    'LAUNCH' : function() {
        // Do something
    },

    'YesIntent' : function() {
        // Do something
    },

    'NoIntent' : function() {
        // Do something
    },

    'END' : function() {
        // Do something
    }
});
```

This means, no matter how deep into the conversation with your voice app the user is, they will always end up at a specific `'YesIntent'` or `'NoIntent'`. As a developer need to figure out yourself which question they just answered with "Yes."

This is where `states` can be helpful. For more complex voice apps that include multiple user flows, it is necessary to remember and route through some user states to understand at which position the conversation currently is. For example, especially "Yes" and "No" as answers might show up across your voice app for a various number of questions. For each question, a state would be very helpful to distinct between different Yes's and No's.

With Jovo, you can include states like this:

```javascript
app.setHandler({

    'LAUNCH' : function() {
        let speech = 'Do you want to order something?';
        let reprompt = 'Please answer with yes or no.';
        this.followUpState('OrderState')
            .ask(speech, reprompt);
    },
    
    // Example: Behave differently for a 'yes' or 'no' answer inside order state
    'OrderState' : {
        
        'YesIntent' : function() {
           // Do something
        },

        'NoIntent' : function() {
           // Do something
        },
    },
});
```

By routing a user to a state (by using [`followUpState`](#followupstate)), this means you can react specifically to this certain situation in the process.

When a user is in a certain state and calls an intent, Jovo will first look if that intent is available in the given state. If not, a fallback option needs to be provided outside any state:

```javascript
app.setHandler({

    'LAUNCH' : function() {
        // do something
    },
    
    // Example: behave differently for a 'yes' or 'no' answer inside order state
    'OrderState' : {
        
        'YesIntent' : function() {
           // do something
        },

        'NoIntent' : function() {
           // do something
        },

    },

    'YesIntent' : function() {
        // do something
    },

    'NoIntent' : function() {
        // do something
    },

    'END' : function() {
        // do something
    }

});
```

Alternatively, you can also use an [`Unhandled`](#unhandled-intent) intent as described in the section above:

```javascript
app.setHandler({

    'LAUNCH' : function() {
        // do something
    },
    
    // Example: behave differently for a 'yes' or 'no' answer inside order state
    'OrderState' : {
        
        'YesIntent' : function() {
           // do something
        },

        'NoIntent' : function() {
           // Do something
        },

    },

    'Unhandled' : function() {
        // Do something
    },

    'END' : function() {
        // Do something
    }

});
```

## followUpState

If you want to route a user to a state after you asked a specific question, you can add a `followUpState`. It is important that you do this before your `ask` call. For example, you can prepend it like this:

```javascript
this.followUpState(stateName)
    .ask(speech, reprompt);
```

This way, the voice app will first look if the response-intent is available in the given state. If not, it will go to the default called intent if it's available outside a state.

```javascript

app.setHandler({

    'LAUNCH' : function() {
        // Ask for a yes-no-question and route to order state
        let speech = 'Do you want to order something?';
        let reprompt = 'Please answer with yes or no.';
        this.followUpState('OrderState')
            .ask(speech, reprompt);
    },
    
    // Example: behave differently for a 'yes' or 'no' answer inside order state
    'OrderState' : {
        
        'YesIntent' : function() {
           // do something
        },

        'NoIntent' : function() {
           // do something
        },

    },

    // Default intents without states below

    'Unhandled' : function() {
        // Do something
    },

    'END' : function() {
        // do something
    }

});
```

## Nested States

You can also nest states for more complex multi-turn conversations:

```javascript
app.setHandler({

    // Other intents

    'State1' : {

        // Other intents

        SomeIntent() {
            this.followUpState('State1.State2')
                .ask('Do you want to proceed?');
        },

        'State2': {
            // Add intents here
        },



    },

});
```

You can nest as many states as you want. As they are objects, you reach them with the `.` separator. You can also use `getState()` to access the current state:

```javascript
this.followUpState(this.getState() + '.State2')
```

## Remove a State

If you are inside a state and want to move outside to a global (stateless) intent in the next request, you have two options:

```javascript
this.removeState();

// Alternative: Use null as followUpState
this.followUpState(null);
```


<!--[metadata]: { "description": "Learn more about how to use states with the Jovo Framework.",
		"route": "routing/states"
                }-->
