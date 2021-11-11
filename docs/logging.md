---
title: 'Logging'
excerpt: 'Learn more about the different types of logging you can do in your Jovo app.'
---

# Logging

Learn more about the different types of logging you can do in your Jovo app.

## Introduction

The main logging feature provided by Jovo is [Basic Logging](#basic-logging), which logs the request and response of each interaction. This is especially relevant for debugging and support requests, for example in the [Jovo Community Forum](https://community.jovo.tech/).

Most Jovo templates enable logging by default. You can find the configuration for this in the `app.ts` file:

```typescript
new App({
  logging: true,
  // ...
});
```

This default configuration will show the full request and response JSON objects in your logs. If you're developing locally, the logs are displayed in your terminal/command line. For other deployment environments, they show up in the respective log service, for example [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) on AWS.

## Configuration

You can modify the logging configuration by turning `logging: true` into an object, like this:

```typescript
new App({
  logging: {
    enabled: true,
    // ...
  },
  // ...
});
```

This is the default configuration:

```typescript
logging: {
  enabled: true,
  request: false,
  maskValue: '[ Hidden ]',
  requestObjects: [],
  maskedRequestObjects: [],
  excludedRequestObjects: [],
  response: false,
  maskedResponseObjects: [],
  excludedResponseObjects: [],
  responseObjects: [],
  indentation: '  ',
  styling: true,
  colorizeSettings: {
    colors: {
      STRING_KEY: 'white',
      STRING_LITERAL: 'green',
      NUMBER_LITERAL: 'yellow',
      BRACE: 'white.bold',
    },
  },
},
```

Below, you can find more information about each of the configurations.

### Request Logging

You can specifically enable and disable the logging of requests with the following config:

```typescript
logging: {
  request: true,
  // ...
},
```

For some platforms, the logs of a request can get quite long if you only need certain information. There are additional config properties to help you with this:

```typescript
logging: {
  requestObjects: [],
  maskedRequestObjects: [],
  excludedRequestObjects: [],
  // ...
},
```

`requestObjects` can be used to only display the properties that are referenced as strings in the array. This can include nested objects. Here is an example:

```typescript
logging: {
  requestObjects: [
    'request',
    'context.System.user'
  ],
  // ...
},
```

In a similar fashion, you can also [mask objects](#masking) or completely remove them from the logs using `excludedRequestObjects`.

### Response Logging

You can specifically enable and disable the logging of responses with the following config:

```typescript
logging: {
  request: true,
  // ...
},
```

Similar to [request logging](#request-logging), you can use additional configurations to modify which elements should be displayed:

```typescript
logging: {
  responseObjects: [],
  maskedResponseObjects: [],
  excludedResponseObjects: [],
  // ...
},
```

### Masking

As described in the [request](#request-logging) and [response logging](#response-logging) sections, you can add masking for specific request or response objects. This is helpful for sensitive data like access tokens or private user information that won't be logged on a server or logging service like AWS Cloudwatch, etc.

```typescript
logging: {
  maskValue: '[ Hidden ]',
  maskedRequestObjects: [],
  maskedResponseObjects: [],
  // ...
},
```

Instead of showing the object's content, the logs will display the `maskValue`, the default being `[ Hidden ]`.

### Styling

You can make changes to the log's styling with the following properties:

```typescript
logging: {
  indentation: '   ',
  styling: true, // Enable or disable styling
  colorizeSettings: {
    colors: { // Change the display of colors
      STRING_KEY: 'white',
      STRING_LITERAL: 'green',
      NUMBER_LITERAL: 'yellow',
      BRACE: 'white.bold',
    },
  },
  // ...
},
```
