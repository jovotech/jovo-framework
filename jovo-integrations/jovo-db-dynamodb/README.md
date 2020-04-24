# Amazon DynamoDB Database Integration

Learn how to store user specific data of your Alexa Skills and Google Actions to AWS DynamoDB.

* [Introduction](#introduction)
* [Configuration](#configuration)
* [Troubleshooting](#troubleshooting)

> Tutorial: [Add DynamoDB to Store User Data](https://www.jovo.tech/tutorials/add-dynamodb-database)

## Introduction

The DynamoDB integration allows you to store user session data in the NoSQL service running on AWS. This integration is especially convenient if you're running your voice app on AWS Lambda. You can find the official documentation about DynamoDB here: [aws.amazon.com/dynamodb](https://aws.amazon.com/dynamodb/).

> [Learn more about hosting your application on AWS Lambda](https://www.jovo.tech/docs/hosting/aws-lambda').

## Configuration

Download the package like this:

```sh
$ npm install --save jovo-db-dynamodb
```

DynamoDB can be enabled in the `src/app.js` file like this:

```javascript
// @language=javascript

// src/app.js

const { DynamoDb } = require('jovo-db-dynamodb');

// Enable DB after app initialization
app.use(new DynamoDb());

// @language=typescript

// src/app.ts

import { DynamoDb } from 'jovo-db-dynamodb';

// Enable DB after app initialization
app.use(new DynamoDb());
```

If you're running your code on Lambda, you can simply integrate a DynamoDB table like this in your `config.js` file:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        DynamoDb: {
            tableName: 'yourTableName',
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
        DynamoDb: {
            tableName: 'yourTableName',
        },
    },

    // ...

};
```

In case you're hosting your voice app somewhere else, you need to additionally add AWS config:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        DynamoDb: {
            tableName: 'yourTableName',
            awsConfig: {
                accessKeyId: 'yourAccessKeyId',
                secretAccessKey: 'yourSecretAccessKey', 
                region:  'yourRegion',
            },
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
        DynamoDb: {
            tableName: 'yourTableName',
            awsConfig: {
                accessKeyId: 'yourAccessKeyId',
                secretAccessKey: 'yourSecretAccessKey', 
                region:  'yourRegion',
            },
        },
    },

    // ...

};
```

You can find a detailed guide by Amazon about setting up your DynamoDB for programmatic access here (In case you're hosting your voice app somewhere else): [Setting Up DynamoDB (Web Service)](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html).

Once the configuration is done, the DynamoDB database integration will create a DynamoDB table on the first read/write attempt (might take some seconds). No need for you to create the table.

## Troubleshooting

Here are a few things you need to consider when switching from a different database to DynamoDB:
* DynamoDB does not allow empty strings (`""`) as values: If you use them, please switch to `null` or a different value