# User

> To view this page on the Jovo website, visit https://www.jovo.tech/docs/data/user

In this section, you will learn how to use the Jovo User class to persist user specific data and create contextual experiences for your voice apps.

* [Introduction to the User Class](#introduction-to-the-user-class)
  * [Configuration](#configuration)
* [Database Integrations](#database-integrations)
  * [Save Data](#save-data)
  * [Load Data](#load-data)
  * [Delete a User](#delete-a-user)
* [Meta Data](#meta-data)
* [Context](#context)
* [Session Data](#session-data)
* [UpdatedAt](#updatedat)
* [User ID](#user-id)
* [Locale](#locale)

## Introduction to the User Class

The `User` object offers helpful features to build contextual, user specific experiences into your voice applications.

You can access the user object like this:

```javascript
this.$user
```

### Configuration

There are certain configurations that can be changed when dealing with the user object. The following are part of the Jovo default configuration and can be changed in the `config.js` file:

```javascript
// config.js file
user: {
    updatedAt: false,
    dataCaching: false,
    implicitSave: true,
    metaData: {
        enabled: false,
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 4,
        devices: true,
    },
    context: {
        enabled: false,
        prev: {
            size: 1,
            request: {
                intent: true,
                state: true,
                sessionId: true,
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
},
```

## Database Integrations

> [Learn more about all available database integrations here](../../integrations/databases '../databases').

The Jovo User object uses [database integrations](../../integrations/databases '../databases') to persist data across sessions. By default, the [file-based system](../../integrations/databases/file-db '../databases/file-db') will be used so you can start right away when prototyping locally.

Also, by default the framework will write to the database with every user interaction (request & response). To enable data caching, i.e. only write to the database if the state of it has changed between the request and the response, you have to add the following to your configuration file:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        dataCaching: true
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        dataCaching: true
    },

    // ...

};
```

Below, learn more about operations you can do for user-specific data:

* [Save Data](#save-data)
* [Load Data](#load-data)
* [Delete a User](#delete-a-user)

### Save Data

This will save data with your user's `userID` as a mainKey, and a `key` and a `value` specified by you.

```javascript
this.$user.$data.key = value;

// Example
this.$user.$data.score = 300;
```

### Load Data

After you saved data, you can use a `key` to retrieve a `value` from the database.

```javascript
let value = this.$user.$data.key;

// Example
let score = this.$user.$data.score;
```

### Delete a User

This will delete your whole user's data (the `mainKey`) from the database.

```javascript
this.$user.delete()

// Example
await this.$user.delete();
```

## Meta Data

The user object meta data is the first step towards building more contextual experiences with the Jovo Framework. If the feature is enabled, the following data is automatically stored inside your database:

Meta Data | Usage | Description
:--- | :--- | :---
createdAt | `this.$user.$metaData.createdAt` | Timestamp: When the user first used your app
lastUsedAt | `this.$user.$metaData.lastUsedAt` | Timestamp: The last time your user interacted with your app
sessionsCount | `this.$user.$metaData.sessionsCount` | Timestamp: How often your user engaged with your app

You can enable meta data like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        metaData: {
            enabled: true,
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        metaData: {
            enabled: true,
        },
    },

    // ...

};
```

You can also overwrite any other of the default configurations:


```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        metaData: {
            enabled: false,
            lastUsedAt: true,
            sessionsCount: true,
            createdAt: true,
            requestHistorySize: 4,
            devices: true,
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        metaData: {
            enabled: false,
            lastUsedAt: true,
            sessionsCount: true,
            createdAt: true,
            requestHistorySize: 4,
            devices: true,
        },
    },

    // ...

};
```


## Context

The user context is used to automatically store data from past interaction pairs (request and response) inside an array. To be able to use this feature, a database integration is required (data is stored in the FilePersistence `db.json` by default, but for e.g. AWS Lambda it is important to set up DynamoDB).

User context can be enabled like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        context: {
            enabled: true,
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        context: {
            enabled: true,
        },
    },

    // ...

};
```

This works like pagination. The most recent request and response pair is stored at `this.$user.$context.prev[0]`.

Right now, the following data can be accessed (with index `i`):

Category | Data | Usage |  | Description
:--- | :--- | :--- | :--- | :----
Request | intent | `this.$user.$context.prev[i].request.intent` | `this.$user.getPrevIntent(i)` | String: Intent name
&nbsp; | state | `this.$user.$context.prev[i].request.state` | `this.$user.getPrevRequestState(i)` | String: State name
&nbsp; | sessionId | `this.$user.$context.prev[i].request.sessionId` | &nbsp; | String: Session Id
&nbsp; | timestamp | `this.$user.$context.prev[i].request.timestamp` | `this.$user.getPrevTimestamp(i)` | String: Timestamp of request
&nbsp; | inputs | `this.$user.$context.prev[i].request.inputs` | `this.$user.getPrevInputs(i)` | Object: Contains all the slots (filled & unfilled). Example: You got a slot called `city`. Access the value with `this.$user.getPrevInputs(i).city.value`.
Response | speech | `this.$user.$context.prev[i].response.speech` |  `this.$user.getPrevSpeech(i)` | String: Primary speech element
&nbsp; | reprompt | `this.$user.$context.prev[i].response.reprompt` | `this.$user.getPrevReprompt(i)` | String: Reprompt element
&nbsp; | state | `this.$user.$context.prev[i].response.state` | `this.$user.getPrevResponseState(i)` | String: State name

The default configuration looks like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        context: {
            enabled: false,
            prev: {
                size: 1,
                request: {
                    intent: true,
                    state: true,
                    sessionId: true,
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
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        context: {
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
    },

    // ...

};
```

You can freely adjust how many of these request-response pairs should be saved by changing the array `size` in your app's config to an Integer equal to or bigger than 0.

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        context: {
            prev: {
                size: 3,
            },
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        context: {
            prev: {
                size: 3,
            },
        },
    },

    // ...

};
```

You can also decide what you want to save and what not. Simply change the value of the unwanted data to `false`:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        context: {
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
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        context: {
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
    },

    // ...

};
```

## Session Data

Some platforms do not provide the ability to persist data throughout a session. In that case, you can save the data in the database. Other platforms, e.g. Twilio Autopilot, need to save the session ID in the database for the `NEW_SESSION` built-in intent to work.

You can enable both in your project's configuration:

```js
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        sessionData: {
            enabled: true,
            data: true,
            id: true
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        sessionData: {
            enabled: true,
            data: true,
            id: true
        },
    },

    // ...

};
```

If the feature is enabled, the database entry will have the following structure:

```js
{
    "userId": "...",
    "userData": {
        "session": {
            "lastUpdatedAt": "ISO 8601 string",
            "$data": {
                ...
            },
            "id": "session ID"
        }
    }
}
```

It is also possible to provide `dataKey` which changes the key under which the data gets saved:

> This is helpful, because some database-integrations like MongoDB do not allow special characters like `$` as field names.

```js
// @language=javascript

// src/config.js

module.exports = {
    
    user: {
        sessionData: {
            enabled: true,
            data: true,
            dataKey: 'customData',
            id: true
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    user: {
        sessionData: {
            enabled: true,
            data: true,
            dataKey: 'customData',
            id: true
        },
    },

    // ...

};
```

This will cause the database-entry to have the following structure:

```js
{
    "userId": "...",
    "userData": {
        "session": {
            "lastUpdatedAt": "ISO 8601 string",
            "customData": {
                ...
            },
            "id": "session ID"
        }
    }
}
```

## UpdatedAt

The `updatedAt` column allows you to store the last time the database entry was updated at (String ISO 8601 format).

```javascript
{
    "userId": "...",
    "userData": {
        "..."
    },
    "updatedAt": "2019-04-03T10:54:54.191Z"
}
```

The option is disabled by default, but you can enable it inside your config file the following way:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    user: {
        updatedAt: true
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    user: {
        updatedAt: true
    },

    // ...

};
```

## User ID

Returns user ID on the particular platform, either Alexa Skill User ID or Google Actions User ID:

```javascript
this.$user.getId();
```

This is going to return an ID that looks like this:

```js
// @platform=Alexa
amzn1.ask.account.AGJCMQPNU2XQWLNJXU2K23R3RWVTWCA6OX7YK7W57E7HVZJSLH4F5U2JOLYELR4PSDSFGSDSD32YHMRG36CUUAY3G5QI5QFNDZ44V5RG6SBN3GUCNTRHAVT5DSDSD334e34I37N3MP2GDCHO7LL2JL2LVN6UFJ6Q2GEVVKL5HNHOWBBD7ZQDQYWNHYR2BPPWJPTBPBXPIPBVFXA

// @platform=Google Assistant
ARke43GoJIqbF8g1vfyDdqL_Sffh
```

Note: Google Action user IDs are generated by Jovo and stored in the Google Action user storage. [Learn more about the process here](../../platforms/google-assistant#user-id '../google-assistant#user-id').


## Locale

Returns the platform's locale:

```javascript
this.$user.getLocale();

// Alternatively, you can also use this
this.getLocale();
```

<!--[metadata]: {"description": "Learn how to use the Jovo User class for contextual voice experiences in your Alexa Skills and Google Actions.",
		        "route": "data/user"}-->
