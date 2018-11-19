# [App Logic](../) > [Data](./README.md) > User

In this section, you will learn how to use the Jovo User class to persist user specific data and create contextual experiences for your voice apps.

* [Introduction to the User Class](#introduction-to-the-user-class)
    * [Configuration](#configuration)
* [Jovo Persistence Layer](#jovo-persistence-layer)
    * [Save Data](#save-data)
    * [Load Data](#load-data)
    * [Delete Data](#delete-data)
    * [Delete a User](#delete-a-user)
* [Meta Data](#meta-data)
* [Context](#context)
* [User ID](#user-id)
* [Locale](#locale)

## Introduction to the User Class

The `User` object offers helpful features to build contextual, user specific experiences into your voice applications.

You can access the user object like this:

```javascript
let user = this.$user;
```

### Configuration

There are certain configurations that can be changed when dealing with the user object. The following are part of the Jovo default configuration:

```javascript
// Using the constructor
const config = {
    saveUserOnResponseEnabled: true,
    userDataCol: 'userData',
    userMetaData: {
        lastUsedAt: false,
        sessionsCount: false,
        createdAt: false,
        requestHistorySize: 0,
        devices: false,
    },
    // Other configurations
};
```
`saveUserOnResponseEnabled`: You can set this to `false` if you choose not to save any user-specific data.

`userDataCol`: Specifies the name of the column that the user data is saved to.

`userMetaData`: Specifies what and how meta data is saved. [Learn more about meta data here](#meta-data).

## Jovo Persistence Layer

This is an abstraction layer for persisting data across sessions. By default, the [file-based system](../../06_integrations/databases/README.md#filepersistence './databases#filepersistence') will be used so you can start right away when prototyping locally, but you can learn how to switch to any of the other integrations [here](../../06_integrations/databases/README.md './databases').

### Save Data

This will save data with your user's `userID` as a mainKey, and a `key` and a `value` specified by you.

```javascript
this.$user.data.key = value;

// Example
this.$user.data.score = 300;
```

### Load Data

After you saved data, you can use a `key` to retrieve a `value` from the database.

```javascript
let data = this.$user.data.key;
```

### Delete Data

This will delete a data point from the database, specified by a key.

```javascript
deleteData(key, callback)

this.db().deleteData(key, function(err) {
    // Do something
});
```

### Delete a User

This will delete your whole user's data (the `mainKey`) from the database.

```javascript
deleteUser(callback)

this.db().deleteUser(function(err) {
    // Do something
});
```

## Meta Data

The user object meta data is the first step towards building more contextual experiences with the Jovo Framework. If the feature is enabled, the following data is automatically stored inside your database:

Meta Data | Usage | Description
:--- | :--- | :---
createdAt | `this.$user.metaData.createdAt` | Timestamp: When the user first used your app
lastUsedAt | `this.$user.metaData.lastUsedAt` | Timestamp: The last time your user interacted with your app
sessionsCount | `this.$user.metaData.sessionsCount` | Timestamp: How often your user engaged with your app


You can change the type of meta data to store with the Jovo app constructor. This is the default configuration for it:

```javascript
const config = {
    userMetaData: {
        enabled: false,
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 4,
        devices: true,
    },
    // Other configurations
};
```

As you can see, the feature is disabled by default. To enable it, you have to flip `enabled` to true in your app's configuration:

```javascript
const config = {
    userMetaData: {
        enabled: true
    },
    // Other configurations
}
```

You can also freely adjust the `requestHistorySize` or what should be saved inside your app's configuration: 

```javascript
const config = {
    userMetaData: {
        enabled: true,
        lastUsedAt: true,
        sessionsCount: false,
        createdAt: true,
        requestHistorySize: 50,
        devices: false,
    },
    // Other configurations
};
```

## Context

The user context is used to automatically store data from past interaction pairs (request and response) inside an array. To be able to use this feature, a database integration is required (data is stored in the FilePersistence `db.json` by default, but for e.g. AWS Lambda it is important to set up DynamoDB.

This works like pagination. The most recent request and response pair are stored at `this.$user.context.prev[0]` and the least recent at `this.$user.context.prev[this.config.userContext.prev.size - 1]`.

Right now, the following data can be accessed (with index `i`):

Category | Data | Usage |  | Description
:--- | :--- | :--- | :--- | :----
Request | intent | `this.$user.context.prev[i].request.intent` | `this.$user.getPrevIntent(i)` | String: Intent name
&nbsp; | state | `this.$user.context.prev[i].request.state` | `this.$user.getPrevRequestState(i)` | String: State name
&nbsp; | timestamp | `this.$user.context.prev[i].request.timestamp` | `this.$user.getPrevTimestamp(i)` | String: Timestamp of request
&nbsp; | inputs | `this.$user.context.prev[i].request.inputs` | `this.$user.getPrevInputs(i)` | Object: Contains all the slots (filled & unfilled). Example: You got a slot called `city`. Access the value with `this.$user.getPrevInputs(i).city.value`.
Response | speech | `this.$user.context.prev[i].response.speech` |  `this.$user.getPrevSpeech(i)` | String: Primary speech element
&nbsp; | reprompt | `this.$user.context.prev[i].response.reprompt` | `this.$user.getPrevReprompt(i)` | String: Reprompt element
&nbsp; | state | `this.$user.context.prev[i].response.state` | `this.$user.getPrevResponseState(i)` | String: State name

The default configuration looks like this:

```javascript
const config = {
    userContext: {
        enabled: false,
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
                output: true,
            },
        },
    },
    // Other configurations
}
```

As you can see, the feature is disabled by default. To enable it, you have to flip `enabled` to true in your app's configuration:

```javascript
const config = {
    userContext: {
        enabled: true
    },
    // Other configurations
}
```

You can also freely adjust how many of these request-response pairs should be saved by changing the array `size` in your app's config to an Integer equal to or bigger than 0.

```javascript
const config = {
    userContext: {
        prev: {
            size: 3,
        },
    },
    // Other configurations
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
    // Other configurations
};
```

## User ID

Returns user ID on the particular platform, either Alexa Skill User ID or Google Actions User ID:

```javascript
this.$user.getId();

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

## Locale

Returns the platform's locale:

```javascript
this.$user.getLocale();

// Alternatively, you can also use this
this.getLocale();
```

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
