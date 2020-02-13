# Google Cloud TTS

Learn how to use the Google Cloud TTS (Text to Speech) service with the Jovo Framework.

## Installation

```sh
npm install jovo-tts-gcloud --save
```

```javascript
// @language=javascript

// src/app.js

const { GCloudTts } = require('jovo-tts-gcloud');

platform.use(
	new GCloudTts({
		credentialsFile: 'path/to/credentials'
	})
);

// @language=typescript

// src/app.ts

import { GCloudTts } from 'jovo-tts-gcloud';

platform.use(
	new GCloudTts({
		credentialsFile: 'path/to/credentials'
	})
);
```

<!--[metadata]: {"description": "Learn how to use the Google Cloud TTS (Text to Speech) service with the Jovo Framework.",
"route": "tts/google-cloud" }-->
