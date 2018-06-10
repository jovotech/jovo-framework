# [App Logic](../) > [Data](./README.md) > User

In this section, you will learn how to use the Jovo User class to persist user specific data and create contextual experiences for your voice apps.

* [Introduction](#introduction-to-the-user-class)
  * [Configuration](#configuration)
* [User Data](#user-data)
  * [Data Persistence](#data-persistence)
  * [Meta Data](#meta-data)
  * [Context](#context)
  * [User ID](#user-id)
  * [Locale](#locale)
  * [Account Linking](#account-linking)


## Introduction to the User Class

The `User` object offers helpful features to build contextual, user specific experiences into your voice applications.

You can access the user object like this:

```javascript
let user = this.user();
```

### Configuration

There are certain configurations that can be changed when dealing with the user object. The following are part of the Jovo default configuration:

```javascript
// Using the constructor
const config = {
    saveUserOnResponseEnabled: true,
    userDataCol: 'userData',
    userMetaData: {
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 0,
        devices: false,
    },
    // Other configurations
};
```
`saveUserOnResponseEnabled`: You can set this to `false` if you choose not to save any user-specific data.

`userDataCol`: Specifies the name of the column that the user data is saved to.

`userMetaData`: Specifies what and how meta data is saved. [Learn more about meta data here](#meta-data).


## User Data

The User object offers the capability to store and retrieve user specific data, including [meta data](#meta-data).

Data is stored using our [database integrations](../../06_integrations/databases './databases'), with a file-based `db.json` structure enabled by default.


### Data Persistence

With our Jovo Persistence Layer, you can store user specific data easily to either a database or a local JSON file.

Just specify a key and a value, and you're good to go: 

```javascript
this.user().data.key = value;

// Example
this.user().data.score = 300;
```

For more information on data persistence, take a look here: [Integrations > Databases](../../06_integrations/databases './databases').


### Meta Data

The user object meta data is the first step towards building more contextual experiences with the Jovo Framework. Right now, the following data is automatically stored (by default on the FilePersistence `db.json`, or DynamoDB if you enable it):

Meta Data | Usage | Description
:--- | :--- | :---
createdAt | `this.user().metaData.createdAt` | Timestamp: When the user first used your app
lastUsedAt | `this.user().metaData.lastUsedAt` | Timestamp: The last time your user interacted with your app
sessionsCount | `this.user().metaData.sessionsCount` | Timestamp: How often your user engaged with your app


You can change the type of meta data to store with the Jovo app constructor. This is the default configuration for it:

```javascript
const config = {
    userMetaData: {
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 0,
        devices: false,
    }
    // Other configurations
};
```

### Context

The user context is used to automatically store data from past interaction pairs (request and response) inside an array. To be able to use this feature, a database integration is required (data is stored in the FilePersistence `db.json` by default, but for e.g. AWS Lambda it is important to set up DynamoDB.

This works like pagination. The most recent request and response pair are stored at `this.user().context.prev[0]` and the least recent at `this.user().context.prev[this.config.userContext.prev.size - 1]`.

Right now, the following data can be accessed (with index `i`):

Category | Data | Usage |  | Description
:--- | :--- | :--- | :--- | :----
Request | intent | `this.user().context.prev[i].request.intent` | `this.user().getPrevIntent(i)` | String: Intent name
&nbsp; | state | `this.user().context.prev[i].request.state` | `this.user().getPrevRequestState(i)` | String: State name
&nbsp; | timestamp | `this.user().context.prev[i].request.timestamp` | `this.user().getPrevTimestamp(i)` | String: Timestamp of request
&nbsp; | inputs | `this.user().context.prev[i].request.inputs` | `this.user().getPrevInputs(i)` | Object: Contains all the slots (filled & unfilled). Example: You got a slot called `city`. Access the value with `this.user().getPrevInputs(i).city.value`.
Response | speech | `this.user().context.prev[i].response.speech` |  `this.user().getPrevSpeech(i)` | String: Primary speech element
&nbsp; | reprompt | `this.user().context.prev[i].response.reprompt` | `this.user().getPrevReprompt(i)` | String: Reprompt element
&nbsp; | state | `this.user().context.prev[i].response.state` | `this.user().getPrevResponseState(i)` | String: State name

By default, only the last interaction pair is stored. You can freely adjust how many of these pairs should be saved by changing the array `size` in your app's config to an Integer equal to or bigger than 0.

```javascript
const config = {
    userContext: {
        prev: {
            size: 3,
        },
    },
};
```

You can also decide what you want to save and what not. Simply change the value of the unwanted data to `false`:
```javascript
const config = {
    userContext: {
        prev: {
            size: 1,
            request: {
                timestamp: false,
            },
            response: {
                state: false,
            },
        },
    },
};
```

The default configuration looks like this:
```javascript
const config = {
    userContext: {
        prev: {
            size: 1,
            request: {
                intent: true,
                state: true,
                inputs: true,
                timestamp: true,
            },
            response: {
                speech: true,
                reprompt: true,
                state: true,
            },
        },
    },
}
```

### User ID

Returns user ID on the particular platform, either Alexa Skill User ID or Google Actions User ID:

```javascript
this.user().getId();

// Alternatively, you can also use this
this.getUserId();
```

This is going to return an ID that looks like this:

```js
// For Amazon Alexa
amzn1.ask.account.AGJCMQPNU2XQWLNJXU2K23R3RWVTWCA6OX7YK7W57E7HVZJSLH4F5U2JOLYELR4PSDSFGSDSD32YHMRG36CUUAY3G5QI5QFNDZ44V5RG6SBN3GUCNTRHAVT5DSDSD334e34I37N3MP2GDCHO7LL2JL2LVN6UFJ6Q2GEVVKL5HNHOWBBD7ZQDQYWNHYR2BPPWJPTBPBXPIPBVFXA

// For Google Assistant
ARke43GoJIqbF8g1vfyDdqL_Sffh
```

### Locale

Returns the platform's locale:

```javascript
this.user().getLocale();

// Alternatively, you can also use this
this.getLocale();
```

### Account Linking

To implement Account Linking in your voice application, you need two core methods.

The first allows you to prompt the user to link their account, by showing a card in the respective companion app:
```javascript
// Alexa Skill:
this.alexaSkill().showAccountLinkingCard();

// Google Actions:
this.googleAction().askForSignIn();
```

The other method returns you the access token, which will be added to every request your skill gets, after the user linked their account:
```javascript
this.getAccessToken();
```

For more information on Account Linking, check out our blogposts:
* [Alexa Skill Account Linking](https://www.jovo.tech/blog/alexa-account-linking-auth0/)
* [Google Actions Account Linking](https://www.jovo.tech/blog/google-action-account-linking-auth0/)

<!--[metadata]: {"title": "User Class", 
                "description": "Learn how to use the Jovo User class for contextual voice experiences in your Alexa Skills and Google Actions.",
                "activeSections": ["logic", "data", "user"],
                "expandedSections": "logic",
                "inSections": "logic",
                "breadCrumbs": {"Docs": "docs/",
				"App Logic": "docs/logic",
                                "Data": "docs/data",
				"User": ""
                                },
		"commentsID": "framework/docs/data/user",
		"route": "docs/data/user"
                }-->
