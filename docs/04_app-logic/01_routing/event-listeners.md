# [App Logic](../) > [Routing](./README.md) > Event Listeners

Learn more about how to use Event Listeners with Jovo.

* [Introduction](#introduction)
* [OnRequest](#onrequest)
* [OnReponse](#onresponse)

## Introduction

Event Listeners are a type of [routing](./README.md './routing') that get triggered when a specific event occurs, for example at the time a request (`onRequest`) or response (`onResponse`) happens, as shown below.

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
app.onRequest(function(jovo) {
    console.log(jovo.getRequestObject());
});
```

`onRequest` is the listener equivalent to the [`'ON_REQUEST'` intent](./README.md#on_request-intent './routing#on_request-intent') in your handler.


## OnResponse

The `onResponse` listener gets triggered with every response your voice application sends.

```javascript
app.onResponse(function(jovo) {
    console.log(jovo.getResponseObject());
});
```

<!--[metadata]: {"title": "Event Listeners", 
                "description": "Find out how to use event listeners with the Jovo Framework",
                "activeSections": ["logic", "routing", "eventlisteners"],
                "expandedSections": "logic",
                "inSections": "logic",
                "breadCrumbs": {"Docs": "docs/",
                                "App Logic": ""
                                },
		"commentsID": "framework/docs/event-listeners",
		"route": "docs/routing/event-listeners"
                }-->
