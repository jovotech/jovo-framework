# Microsoft Azure TTS Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-tts-azure

Learn how to use the Microsoft Azure TTS (Text to Speech) service with the Jovo Framework.

## Installation

```sh
npm install --save jovo-tts-azure
```

```javascript
// @language=javascript

// src/app.js

const { AzureTts } = require('jovo-tts-azure');

platform.use(
  new AzureTts({
    endpointKey: 'yourEndpointKey',
    endpointRegion: 'yourEndpointRegion',
    locale: 'en-US',
  }),
);

// @language=typescript

// src/app.ts

import { AzureTts } from 'jovo-tts-azure';

platform.use(
  new AzureTts({
    endpointKey: 'yourEndpointKey',
    endpointRegion: 'yourEndpointRegion',
    locale: 'en-US',
  }),
);
```
