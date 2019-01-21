# Google Cloud Firestore

Learn how to store user specific data of your Alexa Skills and Google Actions to Google Cloud Firestore.

* [Introduction](#introduction)
* [Configuration](#configuration)


## Introduction

The Firestore integration allows you to store user session data in the NoSQL service running on Google Firebase. This integration is especially convenient if you're running your voice app on Google Cloud Functions. You can find the official documentation about Firestore here: [firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore/).

> [Learn more about hosting your application on Google Cloud Functions](../../configuration/hosting/google-cloud-functions.md '../hosting/google-cloud-functions').

## Configuration

Download the package like this:

```sh
$ npm install --save jovo-db-firestore
```

Firestore can be enabled in the `src/app.js` file like this:

```javascript
const { Firestore } = require('jovo-db-firestore');

// Enable DB after app initialization
app.use(new Firestore());
```

Inside your `config.js` file you have to set your `credential` and your `databaseURL`. You can also optionally set the collection name (default is `UserData`):

```javascript
// config.js file
db: {
    Firestore: {
        credential: require('<path-to-credential-json-file>'),
        databaseURL: '<databaseURL>',
        collectionName: '<collectionName>'
    }
}
```

<!--[metadata]: {"description": "Learn how to store user specific data of your Alexa Skills and Google Actions to Google Firestore.",
"route": "databases/firestore" }-->
