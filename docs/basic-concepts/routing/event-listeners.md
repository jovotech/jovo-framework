# Event Listeners

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/routing/event-listeners

Learn more about how to use Event Listeners with Jovo.

- [Introduction](#introduction)
- [OnRequest](#onrequest)
- [OnReponse](#onresponse)

## Introduction

Event Listeners are a type of [routing](./README.md '../routing') that get triggered when a specific event occurs, for example at the time a request (`onRequest`) or response (`onResponse`) happens, as shown below.

```javascript
app.onRequest(function(jovo) {
    // ...
}

app.onResponse(function(jovo) {
    // ...
}

app.setHandler({
    // ...
});
```

## OnRequest

The `onRequest` listener gets triggered with every request your voice application gets. This can be used for certain features, like getting data that needs to be used for every request, or logging.

```javascript
app.onRequest(function (jovo) {
	console.log(jovo.getRequestObject());
});
```

`onRequest` is the listener equivalent to the [`'ON_REQUEST'` intent](./README.md#on_request-intent './intents#on_request-intent') in your handler.

## OnResponse

The `onResponse` listener gets triggered with every response your voice application sends.

```javascript
app.onResponse(function (jovo) {
	console.log(jovo.getResponseObject());
});
```

<!--[metadata]: {"description": "Find out how to use event listeners with the Jovo Framework",
		        "route": "routing/event-listeners"}-->
