# FileDB Local JSON Database Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-db-filedb

Learn more about the default database for prototyping with Jovo: A file based system that stores user specific data to a JSON file.

* [Introduction](#introduction)
* [Configuration](#configuration)


## Introduction

> Note: This database type is not supposed to be used in production. See other [database integrations](https://v3.jovo.tech/docs/databases) for options when the app is live. 

The FileDB integration allows you to easily store user session data in a JSON file. This is especially helpful for local development and prototyping. Data will be stored to a `db.json` file that can be found in a `db` folder:

```javascript
db/
  └── db.json
models/
src/
project.js
```

This is an example how the file structure looks like, with the `userID` as a mainKey and some persisted data with `someKey` and `someValue`, which can be added with `this.$user.$data.someKey = 'someValue';`:

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

## Configuration

Most Jovo templates come with FileDB as default database integration.

It can be enabled in the `src/app.js` file like this:

```javascript
// @language=javascript

// src/app.js

const { FileDb } = require('jovo-db-filedb');

// Enable DB after app initialization
app.use(new FileDb());

// @language=typescript

// src/app.ts

import { FileDb } from 'jovo-db-filedb';

// Enable DB after app initialization
app.use(new FileDb());
```

In your `config.js` file, you can set the `db` configuration like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},

    // ...

};
```


Once the configuration is done, the File DB database integration will create a file in the specified folder (eg. `../db/db.json`) on the first read/write attempt. No need for you to create the file.
