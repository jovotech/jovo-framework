# LUIS NLU

## Installation

```sh
npm install jovo-nlu-luis --save
```

```javascript
// @language=javascript

// src/app.js

const { LuisNlu } = require('jovo-nlu-luis');

platform.use(
	new LuisNlu({
		endpointKey: 'yourEndpointKey',
		endpointRegion: 'yourEndpointRegion',
		appId: 'yourAppid'
	})
);

// @language=typescript

// src/app.ts

import { LuisNlu } from 'jovo-nlu-luis';

platform.use(
	new LuisNlu({
		endpointKey: 'yourEndpointKey',
		endpointRegion: 'yourEndpointRegion',
		appId: 'yourAppid'
	})
);
```

<!--[metadata]: {"description": "Voice analytics, databases, and more third-party integrations for building voice apps with Jovo",
"route": "nlu/luis" }-->
