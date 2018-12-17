# Logging

In this section, you will learn how to log certain data in your Jovo app.

* [Introduction](#introduction)
* [Log Requests](#log-requests)
* [Log Responses](#log-responses)


## Introduction to Logging

When you're using a local webhook, it's easy to use logging for debugging, like this:

```javascript
console.log('This is going to appear in the logs');
```

For voice app specific debugging, Jovo offers some handy functions for logging incoming requests and outgoing responses.

You can enable logging by using the following:

```javascript
// config.js file
logging: true,
```

This will enable both [Request Logging](#log-requests) and [Response Logging](#log-responses), which can also be  enabled separately. For this, see the sections below.


## Log Requests

You can log the incoming JSON requests by adding the following configuration:

```javascript
// config.js file
logging: {
    request: true,
},
```

The result looks like this (data changed):

```javascript
// Amazon Alexa Request Example
{
  "version": "1.0",
  "session": {
    "new": true,
    "sessionId": "amzn1.echo-api.session.c4551117-1708-446e-a2b2-bg12d2913e3a",
    "application": {
      "applicationId": "amzn1.ask.skill.f5c2b3f3-35e6-4c69-98e1-11e75ee6745b"
    },
    "user": {
      "userId": "amzn1.ask.account.AGJCMQPNU2XQWLNJXU2KXDSTRSDTRDSDSDW4SDVT5DLTZKUH2J25I37N3MP2GDCHO7LL2JL2LVN6UFJ6Q2GEVVKL5HNHOWBBD7ZQDQYWNHYR2BPPWJPTBPBXPIPBVFXA"
    }
  },
  "context": {
    "AudioPlayer": {
      "playerActivity": "IDLE"
    },
    "System": {
      "application": {
        "applicationId": "amzn1.ask.skill.f5c2b3f3-35e6-4c69-98e1-bg12d2913e3a"
      },
      "user": {
        "userId": "amzn1.ask.account.AGJCMQPNU2XQWXDSTRSDTRDSDSDW4SDVT5DOX7YK7W57E7HVZJSLH4F5U2JOLYELR4PTQQJTRJECVPYHMRG36CUUAY3G5QI5QFNDZ44V5RGUCNTRHAVT5DLTZKUH2J25I37N3MP2GDCHO7LL2JL2LVN6UFJ6Q2GEVVKL5HNHOWBBD7ZQDQYWNHYR2BPPWJPTBPBXPIPBVFXA"
      },
      "device": {
        "deviceId": "amzn1.ask.device.AHFATCOCAYDNSDENR7YISGVX2DGRIR3HJHIR47IMLSKZ4TPDRTKBX6AHD2RAIGRMI3WIBMWSUMM3A7JMI5GABHMABUETZWISVZTDDUK3TMVWTGSWQ2BU5VHOIL7KFYFLC6C3YDEMBMHJQOCXRBA",
        "supportedInterfaces": {
          "AudioPlayer": {}
        }
      },
      "apiEndpoint": "https://api.amazonalexa.com"
    }
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "amzn1.echo-api.request.5c96e32a-d803-4ba0-ba04-4293ce23ggf1",
    "timestamp": "2017-07-03T09:56:44Z",
    "locale": "en-US",
    "intent": {
      "name": "HelloWorldIntent",
      "confirmationStatus": "NONE"
    }
  }
}
```

As you can see above, the logs of a request are quite long and impractical, if you only need certain information. With `requestObjects`, you can limit the log output to specific objects.

```javascript
// config.js file
logging: {
    request: true,
    requestObjects: [
      'request',
      'context.System.user'
    ],
},
```

The example for `request` above will reduce the log output to this:

```javascript
// Amazon Alexa Request Example
"type": "IntentRequest",
"requestId": "amzn1.echo-api.request.5c96e32a-d803-4ba0-ba04-4293ce23ggf1",
"timestamp": "2017-07-03T09:56:44Z",
"locale": "en-US",
"intent": {
  "name": "HelloWorldIntent",
  "confirmationStatus": "NONE"
}
```

## Log Responses

You can log the outgoing JSON responses by adding the following configuration:


```javascript
// config.js file
logging: {
    response: true,
},
```

The result looks like this:

```js
// Amazon Alexa Response Example
{
  "version": "1.0",
  "response": {
    "shouldEndSession": true,
    "outputSpeech": {
      "type": "SSML",
      "ssml": "<speak>Hello World!</speak>"
    }
  },
  "sessionAttributes": {}
}
```


Similar to `requestLoggingObjects`, you can limit the response logging output to specific objects, as well.

```javascript
// config.js file
logging: {
    response: true,
    responseObjects: [
      'response'
    ],
},
```

The example above will reduce the log output to this:

```js
// Amazon Alexa Request Example
"shouldEndSession": true,
"outputSpeech": {
  "type": "SSML",
  "ssml": "<speak>Hello World!</speak>"
}
```



<!--[metadata]: {"description": "Learn how to log certain data in your Jovo app.", "route": "data/logging"}-->
