---
title: 'Logging'
excerpt: 'Learn about logging features that help you debug your Jovo apps.'
---

# Logging

Learn about logging features that help you debug your Jovo apps.

## Introduction

The main logging feature provided by Jovo is [Basic Logging](#basic-logging), which logs the request and response of each interaction. This is especially relevant for debugging and support requests, for example in the [Jovo Community Forum](https://community.jovo.tech/).

Most Jovo templates enable logging by default. You can find the configuration for this in the `app.ts` [app configuration](./app-config.md) file:

```typescript
const app = new App({
  logging: true,
  // ...
});
```

This default configuration will show the full request and response JSON objects in your logs. If you're developing locally, the logs are displayed in your terminal/command line. For other deployment environments, they show up in the respective log service, for example [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) on AWS.

Jovo also offers an internal `Logger` that can be used for different log levels. Learn more in the [Jovo Logger](#jovo-logger) section.

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

Here are all configurations:

```typescript
logging: {
  enabled: true,
  request: { /* ... */ },
  response: { /* ... */ },
  maskValue: '[ Hidden ]',
  indentation: '  ',
  styling: true,
  colorizeSettings: { /* ... */ },
  tslog: { /* ... */ },
},
```

- `enabled`: Enable [Basic Logging](#basic-logging) for both requests and responses.
- `request`: Configurations for [request logging](#request-logging).
- `response`: Configurations for [response logging](#response-logging).
- More information about `indentation`, `style`, and `colorizeSettings` can be found in the [styling](#styling) section.
- `tslog`: Configurations for the logging library used by the [Jovo Logger](#jovo-logger).

## Basic Logging

- [Request Logging](#request-logging)
- [Response Logging](#response-logging)
- [Masking](#masking)
- [Styling](#styling)

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
  request: {
    enabled: true,
    objects: [],
    maskedObjects: [],
    excludedObjects: [],
  },
  // ...
},
```

`objects` can be used to only display the properties that are referenced as strings in the array. This can include nested objects. Here is an example:

```typescript
logging: {
  request: {
    objects: [
    'request',
    'context.System.user'
    ],
  },
  // ...
},
```

In a similar fashion, you can also [mask objects](#masking) or completely remove them from the logs using `excludedObjects`.

### Response Logging

You can specifically enable and disable the logging of responses with the following config:

```typescript
logging: {
  response: true,
  // ...
},
```

Similar to [request logging](#request-logging), you can use additional configurations to modify which elements should be displayed:

```typescript
logging: {
  response: {
    enabled: true,
    objects: [],
    maskedObjects: [],
    excludedObjects: [],
  },
  // ...
},
```

### Masking

As described in the [request](#request-logging) and [response logging](#response-logging) sections, you can add masking for specific request or response objects. This is helpful for sensitive data like access tokens or private user information that shouldn't be logged on a server or logging service like AWS Cloudwatch.

```typescript
logging: {
  maskValue: '[ Hidden ]',
  request: {
    maskedObjects: [],
    // ...
  },
  response: {
    maskedObjects: [],
    // ...
  },
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

## Jovo Logger

Jovo has an internal `Logger` that can be used to display certain levels of logs. It is an instance of [tslog](https://tslog.js.org) and can use any features that library provides.

You can add tslog configurations ([learn more on their website](https://tslog.js.org/#/?id=settings)) to the `tslog` property, for example:

```typescript
logging: {
  tslog: {
    prettyInspectOptions: { depth: 3 },
    prefix: [''],
    displayDateTime: false,
  },
  // ...
},
```

You can import the Jovo Logger like this:

```typescript
import { Logger } from '@jovotech/framework';
```

You can use the logger to log to various log levels, which can be set as environment variable `JOVO_LOG_LEVEL`, for example like this:

```typescript
process.env.JOVO_LOG_LEVEL = 'warn';
```

The logs can be done like this:

```typescript
Logger.silly(string); // JOVO_LOG_LEVEL = 'silly'
Logger.trace(string); // JOVO_LOG_LEVEL = 'trace'
Logger.debug(string); // JOVO_LOG_LEVEL = 'debug'
Logger.info(string); // JOVO_LOG_LEVEL = 'info'
Logger.warn(string); // JOVO_LOG_LEVEL = 'warn'
Logger.error(new Error()); // JOVO_LOG_LEVEL = 'error'
Logger.fatal(new Error()); // JOVO_LOG_LEVEL = 'fatal'
```

Learn more about log levels in the [official tslog documentation](https://tslog.js.org/#/?id=log-level).
