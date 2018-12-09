# File DB

Learn how to store user specific data to databases with the Jovo Persistence Layer.

* [Introduction](#introduction)


## Introduction

> Note: This is the default database integration. 

The FilePersistence integration allows you to easily store user session data in a JSON file. This is especially helpful for local development and prototyping. Data will be stored to a db.json file by default.

This sort of data persistence is enabled by default. The `db.json` can be found in the the following folder:

```javascript
db/
  -- db.json
src/
// Other files
```

And this is an example how the file structure looks like, with the `userID` as a mainKey and some persisted data with `someKey` and `someValue`, which can be added with `this.$user.$data.someKey = 'someValue';`:

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

> Note: The FilePersistence integration should only be used for local development as it won't work while hosting your app on a cloud service, e.g. AWS Lambda


<!--[metadata]: {"description": "Learn how to store user specific data to a file-based database with the Jovo Framework",
"route": "databases/file-db" }-->
