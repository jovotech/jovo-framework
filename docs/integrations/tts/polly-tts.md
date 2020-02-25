# Amazon Polly TTS

Learn how to use the Amazon Polly TTS (Text to Speech) service with the Jovo Framework.

## Installation

```sh
npm install jovo-tts-polly --save
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
			secretAccessKey: 'yourSecretAccessKey'
		}
	})
);

// @language=typescript

// src/app.ts

import { PollyTts } from 'jovo-tts-polly';

platform.use(
	new PollyTts({
		credentials: {
			region: 'yourRegion',
			accessKeyId: 'yourAccessKeyId',
			secretAccessKey: 'yourSecretAccessKey'
		}
	})
);
```

> The configuration has to be passed to the constructor of `PollyTts`. Setting the configuration inside the `config`-file does not work.


<!--[metadata]: {"description": "Learn how to use the Amazon Polly TTS (Text to Speech) service with the Jovo Framework.",
"route": "tts/amazon-polly" }-->
