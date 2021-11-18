---
title: 'Server Integrations'
excerpt: 'Jovo offers a variety of server integrations that allow you to host your apps on your own server or cloud platforms like AWS.'
---

# Server Integrations

Jovo offers a variety of server integrations that allow you to host your apps on your own server or cloud platforms like AWS.

## Introduction

The following server integrations are currently working with Jovo `v4`:

- [Express](https://v4.jovo.tech/marketplace/server-express): Host your apps on your own server. This is also used for the local development server.
- [AWS Lambda](https://v4.jovo.tech/marketplace/server-lambda): Host your apps on AWS Lambda serverless functions.

Usually, a server is connected to an [app config stage](./app-config.md#staging). For example, the development stage in `app.dev.ts` uses [Express](https://v4.jovo.tech/marketplace/server-express), which you can see in the last line of the file:

```typescript
export * from './server.express';
```

If you add a new stage using the `jovov4 new:stage <stage>` command (as explained in the [app config docs](./app-config.md#staging)), the Jovo CLI prompts you to select a server integration. So, for example, if you create a new `prod` stage and select [AWS Lambda](https://v4.jovo.tech/marketplace/server-lambda), the following line will be added to your `app.prod.ts`:

```typescript
export * from './server.lambda';
```

## $server Property

You can use the `$server` property to access specific elements from the request and response.

- [`getRequestHeaders`](#getrequestheaders)
- [`getQueryParams`](#getqueryparams)
- [`setResponseHeaders`](#setresponseheaders)

### getRequestHeaders

You can access [request headers](https://developer.mozilla.org/en-US/docs/Glossary/Request_header) using the `getRequestHeaders()` method.

Jovo converts all properties to lowercase. For example, you can access the [`Authorization` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) like this:

```typescript
this.$server.getRequestHeaders().authorization;
```

### getQueryParams

You can access [query parameters](https://en.wikipedia.org/wiki/Query_string) using the `getQueryParams()` method.

```typescript
this.$server.getQueryParams();
```

### setResponseHeaders

You can set additional [response headers](https://developer.mozilla.org/en-US/docs/Glossary/Response_header) that will be merged with existing ones using the `setResponseHeaders()` method.

```typescript
this.$server.setResponseHeaders(header: Record<string, string>);
```
