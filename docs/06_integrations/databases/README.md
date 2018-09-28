# [Integrations](../) > Databases

Learn how to store user specific data to databases with the Jovo Persistence Layer.

* [Jovo Persistence Layer](#jovo-persistence-layer)
  * [Configuration](#configuration)
  * [Save Data](#save-data)
  * [Load Data](#load-data)
  * [Delete Data](#delete-data)
  * [Delete a User](#delete-a-user)
* [FilePersistence](#filepersistence)
* [DynamoDB](#dynamodb)
  * [DynamoDB for Apps Hosted on AWS Lambda](#dynamodb-for-apps-hosted-on-aws-lambda)
  * [DynamoDB for Apps Not Hosted on AWS Lambda](#dynamodb-for-apps-not-hosted-on-aws-lambda)
  * [DynamoDB Troubleshooting](#dynamodb-troubleshooting)


## Jovo Persistence Layer

This is an abstraction layer for persisting data across sessions. By default, the [file-based system](#filepersistence) will be used so you can start right away when prototyping locally.

### Configuration

You can add different database integrations in the Jovo app constructor. This is the default configuration:

```js
const config = {
    db: {
        type: 'file',
        localDbFilename: 'db',
    },
    // Other configurations
}
```


### Save Data

This will save data with your user's `userID` as a mainKey, and a `key` and a `value` specified by you.

The easiest way to do so is to use the [user object](../../04_app-logic/02_data/user.md './data/user') for this:

```javascript
this.user().data.key = value;

// Example
this.user().data.score = 300;
```


### Load Data

After you saved data, you can use a `key` to retrieve a `value` from the database.

Again, you can use the [user object](../../04_app-logic/02_data/user.md './data/user') for this:

```javascript
let data = this.user().data.key;
```

### Delete Data

This will delete a data point from the database, specified by a key.

```javascript
deleteData(key, callback)

this.db().deleteData(key, function(err) {
    // Do something
});
```

### Delete a User

This will delete your whole user's data (the `mainKey`) from the database.

```javascript
deleteUser(callback)

this.db().deleteUser(function(err) {
    // Do something
});
```

## FilePersistence

> Note: This is the default database integration.

The FilePersistence integration allows you to easily store user session data in a JSON file. This is especially helpful for local development and prototyping. Data will be stored to a db.json file by default.

This sort of data persistence is enabled by default. The `db.json` can be found in the the following folder:

```javascript
index.js
db/
  -- db.json
// Other files
```

And this is an example how the file structure looks like, with the `userID` as a mainKey and some persisted data with `someKey` and `someValue`, which can be added with `this.user().data.someKey = 'someValue';`:

```js
// Example for Amazon Alexa
[
	{
		"userId": "amzn1.ask.account.[some_user_id]",
		"userData": {
			"data": {
				"someKey": "someValue"
			},
			"metaData": {
				"createdAt": "2017-11-13T13:46:37.421Z",
				"lastUsedAt": "2017-11-13T14:12:05.738Z",
				"sessionsCount": 9
			}
		}
	}
]
```


## DynamoDB

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

<!--[metadata]: {"title": "Database Integrations", "description": "Learn how to store user specific data to different types of databases with the Jovo Framework", "activeSections": ["integrations", "databases"], "expandedSections": "integrations", "inSections": "integrations", "breadCrumbs": {"Docs": "docs/", "Integrations": "docs/integrations", "Databases": "" }, "commentsID": "framework/docs/databases",
"route": "docs/databases" }-->
