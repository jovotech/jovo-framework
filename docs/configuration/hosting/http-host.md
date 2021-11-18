# Using Node.js built-in http package

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/hosting/http-host

[Node.js built-in http package](https://nodejs.org/api/http.html)

While this method is compatible with most platforms (such as Google's [AppEngine](https://cloud.google.com/appengine/)), it's also much more complicated than using Express.JS and its middlewares.

## index.js

To make your app work use the HttpHost, open your `index.js` file in the `src` folder, and create a http server using `http.createServer()` :

```javascript
// @language=javascript

// src/index.js

import * as http from "http";
import app from "./app.js";
import HttpHost from "HttpHost";

const port = process.env.JOVO_PORT || 443;
http.createServer(async (req, res) => {
  let body = "";
  req.on("readable", () => {
    const data = req.read();
    if (data) {
      body += data;
    }
  });
  req.on("end", () => {
    app.handle(new HttpHost(req, body, res));
    }
  });
}).listen(port);

// @language=typescript

// src/index.ts

import * as http from "http";
import app from "./app.js";
import HttpHost from "HttpHost";

const port = process.env.JOVO_PORT || 443;

http.createServer(async (req, res) => {
  let body = "";
  req.on("readable", () => {
    const data = req.read();
    if (data) {
      body += data;
    }
  });
  req.on("end", () => {
    app.handle(new HttpHost(req, body, res));
  });
}).listen(port);
```

## Alexa

When you want to deploy your code to a webserver other than AWS Lambda, you need to verify that Alexa Skill requests are actually coming from Amazon. Otherwise [you will not pass the Alexa Certification for your Skill.](https://developer.amazon.com/docs/custom-skills/handle-requests-sent-by-alexa.html).

These can be implemented using the [Alexa-verifier](https://www.npmjs.com/package/alexa-verifier) package.

<!--[metadata]: {"description": "Deploy your Google Actions and Alexa Skills to any server with the Jovo Framework using the Node.js built-in http package",
		        "route": "hosting/http-host"}-->
