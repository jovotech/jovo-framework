# [Platform Specific Features](../) > Amazon Alexa

Learn more about Alexa specific features that can be used with the Jovo Framework.

* [Introduction to Alexa Specific Features](#introduction-to-alexa-specific-features)
* [Routing](#routing)
  * [Dialog Interface](#dialog-interface)
* [Data](#data)
  * [Shopping and To Do Lists](#shopping-and-to-do-lists)
  * [User Specific Data](#user-specific-data)
* [Output](#output)
  * [Progressive Responses](#progressive-responses)
  * [Render Templates for Echo Show](#render-templates-for-echo-show)
* [AudioPlayer Skills](#audioplayer-skills)

## Introduction to Alexa Specific Features

> Find an introduction to how Amazon Alexa works here: [Getting Started > Voice App Basics > Amazon Alexa](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_getting-started/voice-app-basics.md/#amazon-alexa).

You can access the `alexaSkill` object like this:

```javascript
let alexa = app.alexaSkill();
```


## Routing

This section provides an overview of Alexa specific features for routing. For the basic concept, take a look here: [App Logic > Routing](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/01_routing).

### Dialog Interface

You can find more about dialog interface here: [Platform specifics > Amazon Alexa > Dialog Mode](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/amazon-alexa/dialog.md).


## Data

This section provides an overview of Alexa specific features for user data. For the basic concept, take a look here: [App Logic > Data](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/02_data).

### Shopping and To Do Lists

Ask for list permissions:

```javascript
app.alexaSkill().showAskForListPermissionCard(['read', 'write']);
```

Here is some example code:

```javascript
const handlers = {

    // Other intents

    'GetShoppingListIntent': function() {
        // Active or completed
        app.user().getShoppingList('active')
            .then((data) => {
                // Iterate through items on list
                for (let obj of data.items) {
                    app.speech.addSentence(obj.value);
                }
                app.tell(app.speech);
            })
            .catch((error) => {
                if (error.code === 'NO_USER_PERMISSION') {
                    app
                        .showAskForListPermissionCard(['read'])
                        .tell('Please grant the permission to access your lists.');
                }
            });
    },

    'GetTodoListIntent': function() {
        // Active or completed
        app.user().getToDoList('active')
            .then((data) => {
                // Iterate through items on list
                for (let obj of data.items) {
                    app.speech.addSentence(obj.value);
                }
                app.tell(app.speech);
            })
            .catch((error) => {
                console.log(error);
            });
    },

    'UpdateToDoListItemIntent': function() {
        app.user().updateToDoList('Pay bills', 'Go Shopping', 'active')
            .then((data) => {
            console.log(data);
                app.tell('Item updated.');
            })
            .catch((error) => {
                if (error.code === 'NO_USER_PERMISSION') {
                    app
                        .showAskForListPermissionCard(['read', 'write'])
                        .tell('Please grant the permission to access your lists.');
                }
                if (error.code === 'ITEM_NOT_FOUND') {
                    app
                        .tell('Item not found.');
                }
        });
    },

    'AddItemToToDoListIntent': function() {
        app.user().addToTodoList('Sleep')
            .then((data) => {
                app.tell('Item added.');
            })
            .catch((error) => {
                if (error.code === 'NO_USER_PERMISSION') {
                    app
                        .showAskForListPermissionCard(['read', 'write'])
                        .tell('Please grant the permission to access your lists');
                }
                console.log(error);
            });
    },

};
```

Here is the [official reference by Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/access-the-alexa-shopping-and-to-do-lists).


### User Specific Data

Ask for permissions like this:

```javascript
// Country and Postal Code
app.alexaSkill().showAskForCountryAndPostalCodeCard();

// Device Address
app.alexaSkill().showAskForAddressCard();
```

Here is an example:

```javascript
const handlers = {

    'LAUNCH': function() {
       // app.toIntent('GetFullAddressIntent');
       app.toIntent('GetCountryPostalCodeIntent');
    },

    'GetFullAddressIntent': function() {
        app.user().getAddress()
            .then((data) => {
                console.log(data);
                app.tell('Your address');
            }).catch((error) => {
            if (error.code === 'NO_USER_PERMISSION') {
                app
                    .showAskForAddressCard()
                    .tell('Please grant access to your address');
            }
        });
    },

    'GetCountryPostalCodeIntent': function() {
        app.user().getCountryAndPostalCode()
            .then((data) => {
                console.log(data);
                app.tell('Your address');
            }).catch((error) => {
            console.log(error);
            if (error.code === 'NO_USER_PERMISSION') {
                app
                    .showAskForCountryAndPostalCodeCard()
                    .tell('Please grant access to your address');
            }
        });
    },
};
```

Here is the [official reference by Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/device-address-api).

## Output

This section provides an overview of Alexa specific features for output. For the basic concept, take a look here: [App Logic > Output](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output).

### Progressive Responses

For responses that require long processing times, you can use progressive responses to tell your users that you are currently working on fulfilling their request.

Here is the official reference by Amazon: [Send the User a Progressive Response](https://developer.amazon.com/docs/custom-skills/send-the-user-a-progressive-response.html).

```javascript
app.alexaSkill().progressiveResponse(speech);
```

Find an example file here: [`indexProgressiveResponse.js`](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/indexProgressiveResponse.js).

### Render Templates for Echo Show

You can find some example code here: [`indexRenderTemplate.js`](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/indexRenderTemplate.js).

Here is the [official reference by Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference).


## AudioPlayer Skills

You can find more about Jovo Audioplayer support here: [Platform specifics > Amazon Alexa > Audioplayer](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/amazon-alexa/audioplayer.md).
