# Google Cloud

[Google Cloud Functions](https://cloud.google.com/functions/) is a serverless hosting solution by Google Cloud. Find the [official documentation here](https://cloud.google.com/functions/docs/).

* [Google Cloud Functions Configuration](#google-cloud-functions-configuration)

> Tutorial: [Deploy to Google Cloud](https://www.jovo.tech/tutorials/deploy-to-google-cloud)

## Google Cloud Functions Configuration

To make your app work on Google Cloud Functions, open your `index.js` file in the `src` folder, and add the following: 

```javascript
const { Webhook, GoogleCloudFunction } = require('jovo-framework');

exports.handler = async (req, res) => {
    await app.handle(new GoogleCloudFunction(req, res));
};
```


<!--[metadata]: {"description": "Deploy your Google Actions and Alexa Skills to Google Cloud Functions with the Jovo Framework",
		        "route": "hosting/google-cloud-functions"}-->
