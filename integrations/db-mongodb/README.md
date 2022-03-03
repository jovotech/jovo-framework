---
title: 'MongoDB Database Integration'
excerpt: 'The MongoDB Jovo integration allows you to store user specific data and more in a MongoDB database.'
---

# MongoDB Database Integration

This [database integration](https://www.jovo.tech/docs/databases) allows you to store user specific data in a MongoDB table.

## Introduction

[MongoDB](https://www.mongodb.com/) is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/db-mongodb
```

Add it as plugin to any stage you like, e.g. `app.prod.ts`:

```typescript
import { MongoDb } from '@jovotech/db-mongodb';

// ...

app.configure({
  plugins: [
    new MongoDb({
      // Configuration
    }),
    // ...
  ],
});
```

Once the configuration is done, the MongoDB database integration will create a MongoDB database and a collection on the first read/write attempt (might take some seconds). No need for you to create the database.

The connection promise is reused in function invocations to speed up communication with the database and keep the connection count to the database at a reasonable level relative to application traffic.

The rest of this section provides an introduction to the steps you need to take depending on where you host your Jovo app:

- [On MongoDB Atlas](#for-apps-hosted-on-mongodb-atlas)

The [configuration section](#configuration) then provides a detailed overview of all configuration options.


## Configuration

The following configurations can be added:

```typescript
new MongoDb(<MongoDbConfig>{
  connectionString: string;
  databaseName?: string;
  collectionName?: string;
}),
```

- MongoDbConfig:
- ``connectionString``: Specify username, password and clusterUrl. Additional parameters can also be added. Have a look at the [MongoDB documentation](https://docs.mongodb.com/drivers/node/current/fundamentals/connection/#connection-uri) for more details.
- ``databaseName``: The name of the database we want to use. If not provided, use database name from connection string. A new database is created if doesn't exist yet.
- ``collectionName``: A new collection is created with that name if doesn't exist yet.

You should specify a DB either in ``connectionString`` or in ``databaseName``. The second takes precedence. The default names for the MongoDb DB and collection are, respectively, `jovo_db` and `jovoUsers`.

Note that you can add timeout or other configuration by adding parameters in the ``connectionString``.

Consult the [MongoDB documentation](https://docs.mongodb.com/drivers/node/current/fundamentals/connection/#connection-uri) for more configuration options.

