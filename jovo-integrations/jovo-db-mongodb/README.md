# MongoDB Database Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-db-mongodb

Learn how to store user specific data of your Alexa Skills and Google Actions to a MongoDb database.

* [Introduction](#introduction)
* [Configuration](#configuration)
* [Troubleshooting](#troubleshooting)
    * [Timeout on AWS Lambda](#timeout-on-aws-lambda)
    * [Connection Refused on MongoDb Atlas](#connection-refused-on-mongodb-atlas)


## Introduction

The MongoDb database integration allows you to store user specific data into the widely supported documented-oriented NoSQL-database.


## Configuration

Download the package like this:

```sh
$ npm install --save jovo-db-mongodb
```

MongoDb can be enabled in the `src/app.js` file like this:

```javascript
// @language=javascript

// src/app.js

const { MongoDb } = require('jovo-db-mongodb');

// Enable DB after app initialization
app.use(new MongoDb());

// @language=typescript

// src/app.ts

import { MongoDb } from 'jovo-db-mongodb';

// Enable DB after app initialization
app.use(new MongoDb());
```

In your `config.js` file, you can set the `db` configuration like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        MongoDb: {
            databaseName: 'yourDatabaseName',
        collectionName: 'yourCollectionName',
        uri: 'yourMongoDbURI',
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
        MongoDb: {
            databaseName: 'yourDatabaseName',
        collectionName: 'yourCollectionName',
        uri: 'yourMongoDbURI',
        },
    },

    // ...

};
```

If you don't specify a collection name, a default collection ```UserData``` will be created in your specified database.

## Troubleshooting

Usually, the MongoDb integration should work as intended. However, we came across some edge cases that can cause the integration to misbehave by not connecting properly to the database.

### Timeout on AWS Lambda

If you want to deploy your skill to AWS Lambda, chances are, your skill will time out trying to connect to your MongoDb database. This is because by default, Lambda waits for all events in the event loop to be finished before returning a response, which means that it waits for the open MongoDb connection to close. To counteract this issue, you can set `callbackWaitsForEmptyEventLoop` to `false` in your `index.js` like so:

```javascript
// @language=javascript
exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await app.handle(new Lambda(event, context, callback));
};

// @language=typescript
export const handler = async (event: any, context: any, callback: Function) => { 
    context.callbackWaitsForEmptyEventLoop = false;
    await app.handle(new Lambda(event, context, callback));
};
```

This tells Lambda to return a response as soon as possible, without waiting for the event loop to be finished.

Read more about best practices [here](https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/).

### Connection Refused on MongoDb Atlas

When you're just getting started with the MongoDb integration and are using the MongoDb Atlas service, a common problem is that your MongoClient will refuse the connection and keep you from accessing your database. This is because on Atlas, you have to whitelist your ip address to keep your database safe from unauthorized access. For that, go to the dashboard of your project on Atlas, select "Network Access" on the right panel and select "ADD IP ADDRESS". Usually, that should be sufficient, but sometimes, your ip address can change, leading to the same problem again. If you don't want to change your address over and over again, you have the option to whitelist every ip address (including your own) by adding `0.0.0.0/0` to the list.

Read more about whitelisting [here](https://docs.atlas.mongodb.com/security-whitelist/).