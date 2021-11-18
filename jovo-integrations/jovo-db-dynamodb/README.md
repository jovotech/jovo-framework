# Amazon DynamoDB Database Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-db-dynamodb

Learn how to store user specific data of your Alexa Skills and Google Actions to AWS DynamoDB.

* [Introduction](#introduction)
* [Configuration](#configuration)
* [Global Secondary Indexes](#global-secondary-indexes)
* [Provisioned throughput](#provisioned-throughput)
* [Troubleshooting](#troubleshooting)

> Tutorial: [Add DynamoDB to Store User Data](https://v3.jovo.tech/tutorials/add-dynamodb-database)

## Introduction

The DynamoDB integration allows you to store user session data in the NoSQL service running on AWS. This integration is especially convenient if you're running your voice app on AWS Lambda. You can find the official documentation about DynamoDB here: [aws.amazon.com/dynamodb](https://aws.amazon.com/dynamodb/).

> [Learn more about hosting your application on AWS Lambda](https://v3.jovo.tech/docs/hosting/aws-lambda).

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

## Global secondary indexes

You have the option to add [global secondary indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html)(GSI) to your DynamoDB table based on the user data. This gives you more flexibility on data access requirements for your user table.

Without GSI, Jovo will create records with two keys in DynamoDB, `userId` and `userData`. Example:

```javascript
// example of data saved in DynamoDB

"Items": [
    {
        "userId": "user-id-1",
        "userData": {
            "data": {
                "yourKey": 1
            }
            ...
        }
    },
    {
        "userId": "user-id-2",
        "userData": {
            "data": {
                "yourKey": 0
            }
            ...
        }
    },
    {
        "userId": "user-id-3",
        "userData": {
            "data": {
                "yourKey": 1
            }
            ...
        }
    }
]
```

If you want to query your user data based on other properties, you can't without GSIs. 

When you configure DynamoDB to use GSI, Jovo behind the scenes will project keys you've specified to the root level. This will allow you to perform DynamoDB queries based on properties inside user data.

GSIs configuration example:

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
            globalSecondaryIndexes: [{
                IndexName: "yourKeyIndex",
                KeySchema: [
                    {
                    AttributeName: "yourKey",
                    // The type you want to store it as. 
                    // LIMITATION: According to DynamoDB docs, HASH and SORT keys can only be "N","S","B".
                    AttributeType: "N", 
                    KeyType: "HASH",
                    // The path from Jovo's userData you want to query on. In this case we want to perform queries based on "yourKey".
                    Path: "data.yourKey",
                    },
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 2,
                    WriteCapacityUnits: 2,
                },
                Projection: {
                    ProjectionType: "ALL",
                },
            }],
        },
    },
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
            globalSecondaryIndexes: [{
                IndexName: "yourKeyIndex",
                KeySchema: [
                    {
                    AttributeName: "yourKey",
                    // The type you want to store it as. 
                    // LIMITATION: According to DynamoDB docs, HASH and SORT keys can only be "N","S","B".
                    AttributeType: "N",
                    KeyType: "HASH",
                    // The path from Jovo's userData you want to query on. In this case we want to perform queries based on "yourKey".
                    Path: "data.yourKey",
                    },
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 2,
                    WriteCapacityUnits: 2,
                },
                Projection: {
                    ProjectionType: "ALL",
                },
            }],
        },
    },
};
```

The above configuration will project `userData.data.yourKey` to the root level of the record. Using the example data above, it will transform the data to look something like this:

```javascript
// example of data saved in DynamoDB

"Items": [
    {
        "userId": "user-id-1",
        "yourKey": 1, // <---- New field added
        "userData": {
            "data": {
                "yourKey": 1
            }
            ...
        }
    },
    {
        "userId": "user-id-2",
        "yourKey": 0, // <---- New field added
        "userData": {
            "data": {
                "yourKey": 0
            }
            ...
        }
    },
    {
        "userId": "user-id-3",
        "yourKey": 1, // <---- New field added
        "userData": {
            "data": {
                "yourKey": 1
            }
            ...
        }
    }
]
```

You can now peform DynamoDB queries based on 'yourKey'.

## Provisioned throughput

You can specify the [provisioned throughput](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html) of your DynamoDB table.

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
            provisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
    },
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
            provisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
    },
};
```

By default if you don't provide a provisioned throughput configuration, Jovo will apply the following to the DynamoDB table and to each global secondary index: 

```javascript
    provisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
```

## Troubleshooting

Here are a few things you need to consider when switching from a different database to DynamoDB:
* DynamoDB does not allow empty strings (`""`) as values: If you use them, please switch to `null` or a different value
