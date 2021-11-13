# Amazon Polly TTS Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-tts-polly

Learn how to use the Amazon Polly TTS (Text to Speech) service with the Jovo Framework.

## Installation

```sh
npm install --save jovo-tts-polly
```

```javascript
// @language=javascript

// src/app.js

const { PollyTts } = require('jovo-tts-polly');

platform.use(
  new PollyTts({
    credentials: {
      region: 'yourRegion',
      accessKeyId: 'yourAccessKeyId',
      secretAccessKey: 'yourSecretAccessKey',
    },
  }),
);

// @language=typescript

// src/app.ts

import { PollyTts } from 'jovo-tts-polly';

platform.use(
  new PollyTts({
    credentials: {
      region: 'yourRegion',
      accessKeyId: 'yourAccessKeyId',
      secretAccessKey: 'yourSecretAccessKey',
    },
  }),
);
```
