# Google Firestore Database Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-db-firestore

Learn how to store user specific data of your Alexa Skills and Google Actions to Google Cloud Firestore.

* [Introduction](#introduction)
* [Configuration](#configuration)
* [Using Firestore outside Google Cloud](#using-firestore-outside-google-cloud)

> Tutorial: [Deploy to Google Cloud](https://v3.jovo.tech/tutorials/deploy-to-google-cloud)

## Introduction

The Firestore integration allows you to store user session data in the NoSQL service running on Google Firebase. This integration is especially convenient if you're running your voice app on Google Cloud Functions. You can find the official documentation about Firestore here: [firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore/).

> [Learn more about hosting your application on Google Cloud Functions](https://v3.jovo.tech/docs/hosting/google-cloud-functions).

## Configuration

Download the package like this:

```sh
$ npm install --save jovo-db-firestore
```

Firestore can be enabled in the `src/app.js` file like this:

```javascript
// @language=javascript

// src/app.js

const { Firestore } = require('jovo-db-firestore');

// Enable DB after app initialization
app.use(new Firestore());

// @language=typescript

// src/app.ts

import { Firestore } from 'jovo-db-firestore';

// Enable DB after app initialization
app.use(new Firestore());
```

If you are using Firestore in other parts of your application and already have an intialized instance, you can just pass that into the constructor as well. This is especially helpful when using Firebase Cloud Functions. When deploying your code to Firebase Cloud Functions you don't need to provide the `databaseURL` and `credential` in the `config.js` file and you won't have the error related to the `initializeApp` method being called twice on the `firebase-admin` instance.

```javascript
// @language=javascript

// src/app.js

const { Firestore } = require('jovo-db-firestore');

// Firebase admin and firestore initialization code
const admin = require('firebase-admin');
admin.initializeApp();
let db = admin.firestore();

// Enable DB after app initialization
app.use(new Firestore({}, db));

// @language=typescript

// src/app.ts

import { Firestore } from 'jovo-db-firestore';

// Firebase admin and firestore initialization code
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

// Enable DB after app initialization
app.use(new Firestore({}, db));
```

Inside your `config.js` file you have to set your `credential` and your `databaseURL`. You can also optionally set the collection name (default is `UserData`):

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        Firestore: {
            credential: require('<path-to-credential-json-file>'),
            databaseURL: '<databaseURL>',
            collectionName: '<collectionName>',
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
        Firestore: {
            credential: require('<path-to-credential-json-file>'),
            databaseURL: '<databaseURL>',
            collectionName: '<collectionName>',
        },
    },

    // ...

};
```

## Using Firestore outside Google Cloud

If you use plan to use the Firestore integration while hosting your project outside Google Cloud Functions (e.g. on AWS Lambda), you have to add the following post install script to your `package.json`:

```javascript
"scripts": {
  "postinstall": "npm install grpc --target=<function-node-version> --target_arch=x64 --target_platform=linux --target_libc=glibc"
},
```

You need the script because the Firestore integration depends on the `firebase-admin` module, which depends on the `grpc` module. If you simply run `npm install` it will download the `grpc` binary for your node version and operating system combination, which might differ from the one Lambda expects, which is `node-v48-linux-x64-glibc`. The script installs the correct binary for you. Find more about that [here](https://github.com/grpc/grpc/issues/6443).