# Polly TTS

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
```

<!--[metadata]: {"description": "Voice analytics, databases, and more third-party integrations for building voice apps with Jovo",
"route": "tts/polly" }-->
