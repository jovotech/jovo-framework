# DynamoDB

Learn how to store user specific data to databases with the Jovo Persistence Layer.

* [Introduction](#introduction)


## Introduction

> Tutorial: [Add DynamoDB to Store User Data](https://www.jovo.tech/tutorials/add-dynamodb-database)

The DynamoDB integration allows you to store user session data in the NoSQL service running on AWS. This integration is especially convenient if you're running your voice app on AWS Lambda. Learn more about DynamoDB here: [aws.amazon.com/dynamodb](https://aws.amazon.com/dynamodb/).

### DynamoDB for Apps Hosted on AWS Lambda

If you're running on Lambda, you can simply integrate a DynamoDB table like this:

```javascript
// Using the constructor
const config = {
    db: {
        type: 'dynamodb',
        tableName: 'TableName',
    },
    // Other configurations
};

// Using the setter
app.setDynamoDb('TableName');
```

This will create a table with a name specified by you, and use this to store and load data. To make it work, you need to give your Lambda Role DynamoDB permissions.

You can find out more in the official documentation by Amazon: [AWS Lambda Permissions Model](http://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html). 

### DynamoDB for Apps Not Hosted on AWS Lambda

In case you're hosting your voice app somewhere else, you can add DynamoDB with the following:

```javascript
let awsConfig = {
    accessKeyId: 'yourAccessKeyId',
    secretAccessKey: 'yourSecretAccessKey', 
    region:  'yourRegion',
};

// Using the constructor
const config = {
    db: {
        type: 'dynamodb',
        tableName: 'TableName',
        awsConfig: awsConfig,
    },
    // Other configurations
};

// Using the setter
app.setDynamoDb('TableName', awsConfig);
```

You can find a detailed guide by Amazon about setting up your DynamoDB for programmatic access here: [Setting Up DynamoDB (Web Service)](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html).

### DynamoDB Troubleshooting

Here are a few things you need to consider when switching from a different database to DynamoDB
* DynamoDB does not allow empty strings (`""`) as values: If you use them, please switch to `null` or a different value

<!--[metadata]: {"description": "Learn how to store user specific data to different types of databases with the Jovo Framework",
"route": "databases/dynamodb" }-->
