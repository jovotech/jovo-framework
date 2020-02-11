# Azure ASR

## Installation

```sh
npm install jovo-asr-azure --save
```

```javascript
// @language=javascript

// src/app.js

const { AzureAsr } = require('jovo-asr-azure');

platform.use(
	new AzureAsr({
		endpointKey: 'yourEndpointKey',
		endpointRegion: 'yourEndpointRegion',
		language: 'en-US'
	})
);

// @language=typescript

// src/app.ts

import { AzureAsr } from 'jovo-asr-azure';

platform.use(
	new AzureAsr({
		endpointKey: 'yourEndpointKey',
		endpointRegion: 'yourEndpointRegion',
		language: 'en-US'
	})
);
```

<!--[metadata]: {"description": "Voice analytics, databases, and more third-party integrations for building voice apps with Jovo",
"route": "asr/azure" }-->
