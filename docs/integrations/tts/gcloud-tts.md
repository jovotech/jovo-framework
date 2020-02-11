# GCloud TTS

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

<!--[metadata]: {"description": "Voice analytics, databases, and more third-party integrations for building voice apps with Jovo",
"route": "tts/gcloud" }-->
