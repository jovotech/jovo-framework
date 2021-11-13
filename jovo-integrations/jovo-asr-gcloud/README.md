# Google Cloud Speech to Text Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-asr-gcloud

Learn how to use the Google Cloud Speech to Text service as ASR (automatic speech recognition) integration with the Jovo Framework.

## Installation

```sh
npm install --save jovo-asr-gcloud
```

```javascript
// @language=javascript

// src/app.js

const { GCloudAsr } = require('jovo-asr-gcloud');

platform.use(
  new GCloudAsr({
    credentialsFile: 'path/to/credentialsFile',
    locale: 'en-US',
  }),
);

// @language=typescript

// src/app.ts

import { GCloudAsr } from 'jovo-asr-gcloud';

platform.use(
  new GCloudAsr({
    credentialsFile: 'path/to/credentialsFile',
    locale: 'en-US',
  }),
);
```
