---
title: 'MongoDB Database Integration'
excerpt: 'The MongoDB Jovo integration allows you to store user specific data in a MongoDB table.'
---

# MongoDB Database Integration

This [database integration](https://www.jovo.tech/docs/databases) allows you to store user specific data in a MongoDB table.

## Introduction

[MongoDB](https://www.mongodb.com/) is 

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
    MongoDb.newInstance({
      // Configuration
    }),
    // ...
  ],
});
```

Once the configuration is done, the MongoDB database integration will create a MongoDB database and a collection on the first read/write attempt (might take some seconds). No need for you to create the database.

The rest of this section provides an introduction to the steps you need to take depending on where you host your Jovo app:

- [On MongoDB Atlas](#for-apps-hosted-on-mongodb-atlas)

The [configuration section](#configuration) then provides a detailed overview of all configuration options.


## Configuration

The following configurations can be added:

```typescript
MongoDb.newInstance({
  connectionString: string;
  databaseName?: string;
  collectionName?: string;
}),

```
- ``connectionString``: Specify username, password and clusterUrl. Additional parameters can also be added. Have a look at the [MongoDB documentation](https://docs.mongodb.com/drivers/node/current/fundamentals/connection/#connection-uri) for more details.
- ``databaseName``: The name of the database we want to use. If not provided, use database name from connection string. A new database is created if doesn't exist yet.
- ``collectionName``: A new collection is created with that name if doesn't exist yet.

You should specify a dataBase either in ``connectionString`` or in ``databaseName``. The second takes precedence.
The default collection name is `users_all`.

Note that you can add timeout or other configuration by adding parameters in the ``connectionString``.

### Examples of use

For better performance, you can reuse the connection in any component like in this example:

```typescript
async START() {
    const mongoDb = MongoDb.getInstance();
    
    // You can read data from another user
    const users = mongoDb.getJovoUsersCollection();
    const otherUserData = (await users).find({ _id: "<another_id>" });

    // Also you can store manage other collections in the same DB Jovo uses to handle users
    const defaultDb = await mongoDb.getJovoManagedDatabase();
    await defaultDb.collection('my-collection').insertOne(otherUserData);

    // Or just get the client to open a transaction 
    const client = await mongoDb.client;
    const transactionResults = await client.startSession().withTransaction(async () => {
      //  modify some data
      // ....
    });
}
```

For the next example, although Jovo will persist it asynchronously during the lifecycle, it will use the same connection pool from the examples above. Reusing the client will get better response times and lower costs.
```typescript
this.$user.data.foo = 'bar';
```


