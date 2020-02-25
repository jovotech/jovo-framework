# Microsoft Azure Speech to Text

Learn how to use the Microsoft Azure Speech to Text service as ASR (Automatic Speech to Text) integration with the Jovo Framework.

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

> The configuration has to be passed to the constructor of `AzureAsr`. Setting the configuration inside the `config`-file does not work.

<!--[metadata]: {"description": "Learn how to use the Microsoft Azure Speech to Text service as ASR (Automatic Speech to Text) integration with the Jovo Framework.",
"route": "asr/microsoft-azure" }-->
