# [App Logic](../) > [Routing](./README.md) > Event Listener

Learn more about how to use Event Listeners with Jovo

* [Introduction](#introduction)
* [OnRequest](#onrequest)
* [OnReponse](#onresponse)

## Introduction

The event listener is function, which get triggered when, as the name says, a specific event occurs.

They should be used in your `app/app.js` file, right above the `app.setHandler()` call:
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

The onRequest listener gets triggered with every request your voice application gets. The listener will automatically route the user to the requested intent.

```javascript
app.onRequest(function(jovo) {
    console.log(jovo.getRequestObject());
});
```

## OnResponse

The onResponse listener gets triggered with every response your voice application sends.

```javascript
app.onResponse(function(jovo) {
    console.log(jovo.getResponseObject());
});
```

<!--[metadata]: {"title": "Event Listeners", 
                "description": "Find out how to build voice app logic with the Jovo Framework",
                "activeSections": ["logic", "routing", "eventlisteners"],
                "expandedSections": "logic",
                "inSections": "logic",
                "breadCrumbs": {"Docs": "framework/docs",
                                "App Logic": ""
                                },
		"commentsID": "framework/docs/event-listeners"
                }-->
