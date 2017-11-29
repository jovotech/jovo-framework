# [Integrations](../) > Databases

Learn how to store user specific data to databases with the Jovo Persistence Layer.

* [Jovo Persistence Layer](#jovo-persistence-layer)
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

### Save Data

This will save data with your user's `userID` as a mainKey, and a `key` and a `value` specified by you.

The easiest way to do so is to use the [user object](ttps://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/02_data/user.md) for this:

```javascript
app.user().data.key = value;

// Example
app.user().data.score = 300;
```

Alternatively, you can use the following method with a callback that's called after a successful (or unsuccessful, for error handling) call of the method:

```javascript
save(key, value, callback)
​
app.db().save(key, value, function(err) {
     // Do something
});
​
// Example
let score = 100;
app.db().save('score', score, function(err) {
       speech = 'Your new score is ' + score + ' points.';
       app.tell(speech);
});
```

### Load Data

After you saved data, you can use a `key` to retrieve a `value` from the database.

Again, you can use the [user object](ttps://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/02_data/user.md) for this:

```javascript
let data = app.user().data.key;
```

Or use the `load` method:

```javascript
load(key, callback)
​
app.db().load(key, function(err, data) {
    // Do something
});
​
// Example
app.db().load('score', function(err, data) {
    let score = data;
    speech = 'Your current score is ' + score + ' points.';
    app.tell(speech);
});
```

### Delete Data

This will delete a data point from the database, specified by a key.

```javascript
deleteData(key, callback)
​
app.db().deleteData(key, function(err) {
    // Do something
});
```

### Delete a User

This will delete your whole user's data (the `mainKey`) from the database.

```javascript
deleteUser(callback)
​
app.db().deleteUser(function(err) {
    // Do something
});
```

## FilePersistence

> This is the default database integration.

The FilePersistence integration allows you to easily store user session data in a JSON file. This is especially helpful for local development and prototyping. Data will be stored to a db.json file by default.

This sort of data persistence is enabled by default. The `db.json` can be found in the the following folder:

```javascript
index.js
db/
  └── db.json
// Other files
```

And this is an example how the file structure looks like, with the `userID` as a mainKey and some persisted data with `someKey` and `someValue`, which can be added with `app.user().data.someKey = 'someValue';`:

```json
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

The DynamoDB integration allows you to store user session data in the NoSQL service running on AWS. This integration is especially convenient if you’re running your voice app on AWS Lambda. Learn more about DynamoDB here: [aws.amazon.com/dynamodb](https://aws.amazon.com/dynamodb/).

### DynamoDB for Apps Hosted on AWS Lambda

If you're running on Lambda, you can simply integrate a DynamoDB table like this:

```javascript
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

app.setDynamoDb('TableName', awsConfig);
```

You can find a detailed guide by Amazon about setting up your DynamoDB for programmatic access here: [Setting Up DynamoDB (Web Service)](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html).

### DynamoDB Troubleshooting

Here are a few things you need to consider when switching from a different database to DynamoDB
* DynamoDB does not allow empty strings (`""`) as values: If you use them, please switch to `null` or a different value
