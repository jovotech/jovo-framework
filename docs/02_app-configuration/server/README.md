# [App Configuration](./) > Server

Find more information on server integrations here:

Name | Description | Docs
------------ | ------------- | -------------
Webhook | Run an express server as HTTPS endpoint | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/webhook.md)
AWS Lambda | Run the voice app as AWS Lambda Function | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/aws-lambda.md)


## Code Examples

### Webhook

```javascript
const app = require('jovo-framework').Jovo;
const webhook = require('jovo-framework').Webhook;

// Other configurations go somewhere here

// Listen for post requests
webhook.listen(3000, function() {
    console.log('Local development server listening on port 3000.');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});

// App Logic below
```

### AWS Lambda

```javascript
const app = require('jovo-framework').Jovo;

// Other configurations go somewhere here

exports.handler = function(event, context, callback) {
    app.handleRequest(req, res, handlers);
    app.execute();
};

// App Logic below
```