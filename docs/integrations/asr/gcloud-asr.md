# GCloud ASR

## Installation

```sh
npm install jovo-asr-gcloud --save
```

```javascript
// @language=javascript

// src/app.js

const { GCloudAsr } = require('jovo-asr-gcloud');

platform.use(
	new GCloudAsr({
		credentialsFile: 'path/to/credentialsFile',
		locale: 'en-US'
	})
);

// @language=typescript

// src/app.ts

import { GCloudAsr } from 'jovo-asr-gcloud';

platform.use(
	new GCloudAsr({
		credentialsFile: 'path/to/credentialsFile',
		locale: 'en-US'
	})
);
```

<!--[metadata]: {"description": "Voice analytics, databases, and more third-party integrations for building voice apps with Jovo",
"route": "asr/gcloud" }-->
