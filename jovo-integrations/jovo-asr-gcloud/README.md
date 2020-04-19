# Google Cloud Speech to Text Integration

Learn how to use the Google Cloud Speech to Text service as ASR (automatic speech recognition) integration with the Jovo Framework.

## Installation

```sh
npm install --save jovo-asr-gcloud
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

> The configuration has to be passed to the constructor of `GCloudAsr`. Setting the configuration inside the `config`-file does not work.
