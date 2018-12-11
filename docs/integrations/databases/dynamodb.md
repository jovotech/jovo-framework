# DynamoDB

Learn how to store user specific data of your Alexa Skills and Google Actions to AWS DynamoDB.

* [Introduction](#introduction)
* [Configuration](#configuration)
* [Troubleshooting](#troubleshooting)

> Tutorial: [Add DynamoDB to Store User Data](https://www.jovo.tech/tutorials/add-dynamodb-database)

## Introduction

The DynamoDB integration allows you to store user session data in the NoSQL service running on AWS. This integration is especially convenient if you're running your voice app on AWS Lambda. You can find the official documentation about DynamoDB here: [aws.amazon.com/dynamodb](https://aws.amazon.com/dynamodb/).

> [Learn more about hosting your application on AWS Lambda](../../configuration/hosting/aws-lambda.md '../hosting/aws-lambda').

## Configuration

Download the package like this:

```sh
$ npm install --save jovo-db-dynamodb
```

DynamoDB can be enabled in the `src/app.js` file like this:

```javascript
const { DynamoDb } = require('jovo-db-dynamodb');

// Enable DB after app initialization
app.use(new DynamoDb());
```

If you're running your code on Lambda, you can simply integrate a DynamoDB table like this in your `config.js` file:

```javascript
// config.js file
db: {
    DynamoDb: {
        tableName: 'yourTableName',
    }
}
```

In case you're hosting your voice app somewhere else, you need to additionally add AWS config:

```javascript
db: {
    DynamoDb: {
        tableName: 'yourTableName',
        awsConfig: {
            accessKeyId: 'yourAccessKeyId',
            secretAccessKey: 'yourSecretAccessKey', 
            region:  'yourRegion',
        }
    }
}
```

You can find a detailed guide by Amazon about setting up your DynamoDB for programmatic access here: [Setting Up DynamoDB (Web Service)](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html).

## Troubleshooting

Here are a few things you need to consider when switching from a different database to DynamoDB:
* DynamoDB does not allow empty strings (`""`) as values: If you use them, please switch to `null` or a different value

<!--[metadata]: {"description": "Learn how to store user specific data of your Alexa Skills and Google Actions to AWS DynamoDB.",
"route": "databases/dynamodb" }-->
