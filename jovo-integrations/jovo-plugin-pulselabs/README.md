# Jovo PulseLabs Plugin

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-plugin-pulselabs

* [Installation](#installation)
* [Configuration](#configuration)

## Installation

```sh
npm install --save jovo-plugin-pulselabs
```

Add the plugin to your `app.js` file:

```js
// src/app.js

const { PulseLabs } = require ('jovo-plugin-pulselabs');

app.use( new PulseLabs({ apiKey: 'yourApiKey' }) );
```

# Configuration

You can pass additional configuration options as below:

```js

app.use( new PulseLabs({ apiKey: 'yourApiKey' , options: { timeout: 2000, debug: true } }) );
```

***debug*** - ```boolean``` logs helpful debugging information
<br/>
***timeout*** - ```number``` timeouts requests after given milliseconds
