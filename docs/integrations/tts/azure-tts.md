# Azure TTS

## Installation

```sh
npm install jovo-tts-azure --save
```

```javascript
// @language=javascript

// src/app.js

const { AzureTts } = require('jovo-tts-azure');

platform.use(
	new AzureTts({
		endpointKey: 'yourEndpointKey',
		endpointRegion: 'yourEndpointRegion',
		locale: 'en-US'
	})
);

// @language=typescript

// src/app.ts

import { AzureTts } from 'jovo-tts-azure';

platform.use(
	new AzureTts({
		endpointKey: 'yourEndpointKey',
		endpointRegion: 'yourEndpointRegion',
		locale: 'en-US'
	})
);
```

<!--[metadata]: {"description": "Voice analytics, databases, and more third-party integrations for building voice apps with Jovo",
"route": "tts/azure" }-->
