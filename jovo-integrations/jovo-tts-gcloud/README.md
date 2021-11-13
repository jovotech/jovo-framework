# Google Cloud TTS Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-tts-gcloud

Learn how to use the Google Cloud TTS (Text to Speech) service with the Jovo Framework.

## Installation

```sh
npm install --save jovo-tts-gcloud
```

```javascript
// @language=javascript

// src/app.js

const { GCloudTts } = require('jovo-tts-gcloud');

platform.use(
  new GCloudTts({
    credentialsFile: 'path/to/credentials',
  }),
);

// @language=typescript

// src/app.ts

import { GCloudTts } from 'jovo-tts-gcloud';

platform.use(
  new GCloudTts({
    credentialsFile: 'path/to/credentials',
  }),
);
```
