# MongoDb

Learn how to store user specific data of your Alexa Skills and Google Actions to a MongoDb database.

* [Introduction](#introduction)
* [Configuration](#configuration)


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


<!--[metadata]: {"description": "Learn how to store user specific data of your Alexa Skills and Google Actions to a MongoDb database.",
"route": "databases/mongodb" }-->