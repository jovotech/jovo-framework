# Azure CosmosDB Database Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-db-cosmosdb

Learn how to store user specific data of your Alexa Skills and Google Actions to Cosmos DB.

* [Introduction](#introduction)
* [Configuration](#configuration)

> Tutorial: [Deploy to Azure](https://v3.jovo.tech/tutorials/deploy-to-azure)

## Introduction

The Cosmos DB integration allows you to store user session data in the NoSQL service running on Azure using their MongoDB API. This integration is especially convenient if you're running your voice app on Azure Functions. You can find the official documentation about Cosmos DB here: [docs.microsoft.com/cosmos-db](https://docs.microsoft.com/en-us/azure/cosmos-db/).

> [Learn more about hosting your application on Azure Functions](https://v3.jovo.tech/docs/hosting/azure-functions).

## Configuration

Download the package like this:

```sh
$ npm install --save jovo-db-cosmosdb
```

Cosmos DB can be enabled in the `src/app.js` file like this:

```javascript
// @language=javascript

// src/app.js

const { CosmosDb } = require('jovo-db-cosmosdb');

// Enable DB after app initialization
app.use(new CosmosDb());

// @language=typescript

// src/app.ts

import { CosmosDb } from 'jovo-db-cosmosdb';

// Enable DB after app initialization
app.use(new CosmosDb());
```

Inside your `config.js` file you have to set your `primary connection string` and your database name. You can also optionally set the collection name (default is `UserData`):

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        CosmosDb: {
            uri: '<primary_connection_string>',
            databaseName: '<database_name>',
            collectionName: '<collection_name>'
        }
    }

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
        CosmosDb: {
            uri: '<primary_connection_string>',
            databaseName: '<database_name>',
            collectionName: '<collection_name>'
        }
    }

    // ...

};
```